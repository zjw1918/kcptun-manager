# kcptunmanager
A kcptun manager. Write in electron.

1. Download tcptun client from offical site
2. Choose path/to/client_linux_amd64
3. fill the proper args, eg:

| name:        |     value:       | 
| ------------- |:-------------:| 
| -r        | x.x.x.x:9000  |
| -l        | :9000         |
| -mode     | fast2         |
| --key     | test          |
| --crypt   | aes-192       |

Every arg is necessary.
If don't know how to fill the args, read official kcptun's github, thanks.

Tested in ubuntu 16.04 x64, ok.