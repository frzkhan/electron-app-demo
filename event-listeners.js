const { ipcMain } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
ipcMain.on('video:convert', (event, filePaths) => {
  if (!filePaths.length) return
  const input = filePaths[0]
  const output = 'video-output'+new Date().getTime()+'.mp4'
  //ffmpeg -i input.avi -c:v libx264 -crf 19 -preset slow -c:a aac -b:a 192k -ac 2 out.mp4
	ffmpeg(input)
        .withVideoCodec('libx264')
				.addOptions(['-crf 19', '-preset slow'])
        .withAudioCodec('aac')
        .withAudioBitrate('192k')
        .withAudioChannels(2)
        .toFormat('mp4')
				.save('./static/' + output)
        .on('progress', function(progress) {
          console.log(progress);
          event.sender.send('video:convert:progress', progress)
        })
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
          event.sender.send('video:convert:complete', output)
          console.log('Processing finished !');
        })
})
ipcMain.on('video:dialog:open', (event) => {
  dialog.showOpenDialog({
    properties: [ 'openFile' ]
  }, (filePaths) => {
    console.log(filePaths);
    event.sender.send('video:dialog:open:complete', filePaths)
  })
})
