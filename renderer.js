const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const spawn = require('child_process').spawn;
let remote = require('electron').remote;  

let child = null

const ipc = require('electron').ipcRenderer

ipc.on('information-dialog-selection', function (event, index) {
  let message = 'You selected '
  if (index === 0) message += 'yes.'
  else message += 'no.'
  console.log(message)

  if (index === 0) {
      if (child) {
          child.kill()
      }
      ipc.send('kill', true)
  }

})

const btn_execFile = document.getElementById('exec-file')

let argsObj
let filePath
let fileCtrl

btn_execFile.addEventListener('click', () => {

    checkSave()
    if (Object.keys(argsObj).length !== 6) {
        console.log('进来了')
        console.log(argsObj)
        // notifier.notify({ title:'Warning!', message:'参数不正确' })
        alert('参数不正确')
        return
    }
    for (let i in argsObj) {
        if (argsObj[i].trim() === '') {
            // notifier.notify({ title:'Warning!', message:'参数不能为空，若不知道，请参照有关文档填写默认值！' })
            alert('参数不能为空，若不知道，请参照有关文档填写默认值！')
            return
        }
    }

    // console.log(arguments)
    if (child) {
        // notifier.notify({ title:'Warning!', message:'哟，貌似不能重复开启呢' })
        alert('哟，貌似不能重复开启呢')
        return
    }

    const execFile = require('child_process').execFile;
    child = execFile(argsObj['filePath'], [
        '-r', argsObj['r'], 
        '-l', argsObj['l'], 
        '-mode', argsObj['mode'], 
        '--key', argsObj['key'], 
        '--crypt', argsObj['crypt']]);

    child.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
        document.getElementById('log').innerHTML = data + '<br>'
    });

    child.stderr.on('data', (data) => {
        // console.log(`stderr: ${data}`);
        document.getElementById('log').innerHTML = data + '<br>'
    });

    child.on('close', (code) => {
        // console.log(`child process exited with code ${code}`);
        document.getElementById('log').innerHTML += '<br>' + `child process exited with code ${code}`
    });

    // setTimeout(()=> {console.log(child.kill);child.kill()}, 10000)
})

function checkSave() {
    // argsObj = {}
    var form = document.forms[0]
    argsObj['r'] = form[0].value
    argsObj['l'] = form[1].value
    argsObj['mode'] = form[2].value
    argsObj['key'] = form[3].value
    argsObj['crypt'] = form[4].value

    fileCtrl =  document.getElementById('rawFile').files[0]
    if (fileCtrl) {
        argsObj['filePath'] = fileCtrl.path
    }
    if (!argsObj.hasOwnProperty('filePath')) {
        // notifier.notify({ title:'Warning!', message:'未选择客户端文件！' })
        alert('未选择客户端文件！')
        return
    }

    window.localStorage.setItem('args', JSON.stringify(argsObj))
    console.log(argsObj)
}

// init args
function initArgs(params) {
    argsObj = JSON.parse(window.localStorage.getItem('args'));
    if (argsObj) {
        console.log(argsObj)
        let tmpForm = document.forms[0]
        tmpForm[0].value = argsObj['r']
        tmpForm[1].value = argsObj['l']
        tmpForm[2].value = argsObj['mode']
        tmpForm[3].value = argsObj['key']
        tmpForm[4].value = argsObj['crypt']
        document.getElementById('filePath').innerHTML = argsObj['filePath']
        return
    }
    argsObj = {}
    console.log('当前未保存参数')
}
initArgs();


// require('electron').remote.getCurrentWindow().on('close', (e) => {
//     // ...
// })
