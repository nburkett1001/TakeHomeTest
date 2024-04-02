const express = require('express');
const webServer = express();

webServer.get('/', (req, res) => 
{
    try
    {
        const csv = req.query.csv.trim();
        res.send(convertLine(csv));
    }
    catch(err)
    {
        res.send(err);
    }
});

function convertLine(csv)
{
    // cumulative output
    var strings = "";

    // scanning indexes
    var index = 0;
    var idxFirstQuote = 0;
    var idxFirstChar = 0;

    // states
    const State = 
    {
        NEEDFIRST: 0,
        NEEDCOMMA: 1,
        NEEDLASTCHAR: 2,
        NEEDCLOSINGQUOTE: 3
    }

    // state
    state = State.NEEDFIRST;

    while(index < csv.length)
    {
        const char = csv[index];
        switch(state)
        {
            case State.NEEDFIRST:
                if(char == ' ')
                {
                }
                else if(char == '"')
                {
                    idxFirstQuote = index;
                    state = State.NEEDCLOSINGQUOTE;
                }
                else if(char == ',')
                {
                    strings += '[] ';
                }
                else
                {
                    idxFirstChar = index;
                    state = State.NEEDLASTCHAR;
                }
                break;
            case State.NEEDCOMMA:
                if(char == ',')
                {
                    state = State.NEEDFIRST;
                }
                else if(char != ' ')
                {
                    throw "expected a comma, found '" + char + "'";
                }
                break;
            case State.NEEDLASTCHAR:
                if(char == ' ')
                {
                    strings += '[' + csv.substring(idxFirstChar, index) + '] ';
                    state = State.NEEDCOMMA;
                }
                else if(char == ',')
                {
                    strings += '[' + csv.substring(idxFirstChar, index) + '] ';
                    state = State.NEEDFIRST;
                }
                break;
            case State.NEEDCLOSINGQUOTE:
                if(char == '"')
                {
                    strings += '[' + csv.substring(idxFirstQuote + 1, index) + '] ';
                    state = State.NEEDCOMMA;
                }
                break;
        }
        index++;
    }
    switch(state)
    {
        case State.NEEDLASTCHAR:
            strings += '[' + csv.substring(idxFirstChar, index - 1) + ']';
            break;
        case State.NEEDCLOSINGQUOTE:
            throw "expected a closing quote";
    }

    return strings.trim();
}

webServer.listen(3000, () => 
{
    console.log('HTTP Web Service running on port 3000');
});