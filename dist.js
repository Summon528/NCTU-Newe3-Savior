const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/dist.zip');
const archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

archive.file('manifest.json', { name: 'manifest.json' });
archive.file('icon.png', { name: 'icon.png' });
archive.directory('dist/', 'dist');
archive.finalize();
