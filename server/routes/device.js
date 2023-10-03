// /server/routes/device.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const si = require('systeminformation');
const { exec } = require('child_process');


router.get('/device', async (req, res) => {
    try {
      const system = await si.system();
      const cpu = await si.cpu();
      const ramData  = await si.mem();
      const osInfo = await si.osInfo();
      const disk = await si.fsSize();
      const batteryData = await si.battery();

      const ram = {
        total: (ramData.total / (2 ** 30)).toFixed(2) + ' GB',
        free: (ramData.free / (2 ** 30)).toFixed(2) + ' GB',
        used: (ramData.used / (2 ** 30)).toFixed(2) + ' GB',
        active: (ramData.active / (2 ** 30)).toFixed(2) + ' GB',
      };
  
      const deviceInfo = {
        system,
        cpu,
        ram,
        batteryData,
        osInfo,
        disk,
      };
  
      res.json(deviceInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  router.get('/internet-speed', (req, res) => {
    exec('speedtest -f json', (error, stdout, stderr) => {
      if (error) {
        res.status(500).send(error.toString());
        return;
      }
      if (stderr) {
        res.status(500).send(stderr);
        return;
      }
      res.send(stdout);
    });
  });

router.get('/battery-report', (req, res) => {
  const reportPath = path.join(__dirname, 'battery-report.html'); // Specify the full path where the report should be generated
  
  exec(`powercfg /batteryreport /output "${reportPath}"`, (error) => {
    if (error) {
      console.error('Error executing powercfg:', error);
      res.status(500).send('Failed to generate battery report');
      return;
    }

    fs.readFile(reportPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading battery report file:', err);
        res.status(500).send('Failed to read battery report');
        return;
      }

      res.send(data); // Send the content of the HTML file as a response
    });
  });
});

module.exports = router;
