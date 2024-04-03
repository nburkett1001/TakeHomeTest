to use:  http://<ipaddress:port>?csv=<your CSV line here>
to run from command line on a system with node installed:  node HSnode2.js

example usage:  http://192.168.0.1:3000?csv="Patient Name","SSN","Age","Phone Number","Status"

Not all the requirements were clear, so I am allowing quotes to be embedded within a string, for example the text:  42"33axy, "hello", 42 will be converted to [42"33axy] [hello] [42]

