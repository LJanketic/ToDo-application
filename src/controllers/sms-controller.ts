import * as dotenv from 'dotenv';

import * as followRedirects from 'follow-redirects';

import config, { Config } from '../config';

dotenv.config();

const https = followRedirects.https;
const { server: serverConfig }: Config = config(process.env);

const sendSMS = (todoText: string) => {
  const { smsSender, smsDestination, smsHost, smsKey } = serverConfig;
  console.log(typeof smsKey, smsKey);
  const options = {
    method: 'POST',
    hostname: smsHost,
    path: '/sms/2/text/advanced',
    headers: {
      Authorization: smsKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    maxRedirects: 20,
  };

  const req = https.request(options, function (res: any) {
    const chunks: any[] = [];

    res.on('data', function (chunk: any) {
      chunks.push(chunk);
    });

    // eslint-disable-next-line no-unused-vars
    res.on('end', function (chunk: any) {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on('error', function (error: any) {
      console.error(error);
    });
  });

  const postData = JSON.stringify({
    messages: [
      {
        destinations: [{ to: smsDestination }],
        from: smsSender,
        text: `Your ${todoText} is marked as done.`,
      },
    ],
  });

  req.write(postData);
  req.end();
};

export default sendSMS;
