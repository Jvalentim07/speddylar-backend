const express = require('express')
const cors = require('cors')
const puppeteer  = require('puppeteer'); 
import nodemailer from 'nodemailer'

const getReviews = async () => {
  const browser = await puppeteer.launch({args: ['--disabled-setuid-sandbox', '--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://www.google.com/maps/place/Speedy+Lar+Mudan%C3%A7as+%7C+Mudan%C3%A7as+Residenciais+%7C+Mudan%C3%A7as+Comerciais/@-23.473192,-46.6860946,14z/data=!4m5!3m4!1s0x0:0xea3d4950e31608fb!8m2!3d-23.4695114!4d-46.6847428')
  console.log('waiting for selector');
  // if (shouldScrollPage) {
  //   await scrollPage(page);
  // }
  // const pageContent = await page.content();
  // let seila = {}
  // const stars = await page.$$eval('.ODSEW-ShBeI-content', (el) => el.map(y => y.textContent));
  const texts = await page.$$eval('.ODSEW-ShBeI-text', (el) => el.map(y => y.textContent));
  const titles = await page.$$eval('.ODSEW-ShBeI-title', (el) => el.map(y => y.textContent));
  const data = titles.map((x, i) => {
    return {
      title: x,
      text: texts[i]
    }
  })

  console.log(data);
  //   seila = document.getElementsByClassName('ODSEW-ShBeI-title');
  //   const reviewAuthorText = document.getElementsByClassName('ODSEW-ShBeI-text');
  //   teste(reviewAuthorText)
    
  //   return reviewAuthorText
  // })
  await page.close();
  await browser.close();
  return await new Promise((resolve, reject) => {
      resolve(data);
      if(reject) {
          reject({error: "error while scraping data."})
      }
  })
}


const send = async (res) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount()
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
        },
    });
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "jvalentim0707@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return 'Email Enviado'
}

const app = express()
const port = 3000
app.use(cors())

app.get('/', (req, res) => {
  return res.send('Hello World!')
})

app.get('/contact', async (req, res) => {
    const reviews = await getReviews()
    // console.log(JSON.stringify(data))
    // await send()
    return true
  })

  app.get('/reviews', async (req, res) => {
    const reviews = await getReviews()
    console.log('aq')
    // console.log(JSON.stringify(data))
    // await send()
    console.log(reviews)
    res.send(reviews)
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})