const express = require("express");
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const fetch = require("isomorphic-unfetch");
const midtransClient = require('midtrans-client');
const bodyParser = require('body-parser');
const PORT = 4000;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next();
});


const getOngkirCheck = async (request, response) => {
  try {
    fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        key: "84bd7061ceff95c1279aaa87099a5ea7",
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        origin: request.body.origin,
        destination: request.body.destination,
        weight: request.body.weight,
        courier: request.body.courier
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data:', data.rajaongkir);
        return response.status(200).send({ data: data });
      })
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/cek_ongkir", getOngkirCheck);
// app.get("/api/cek_ongkir", getOngkirCheck);


// // Midtrans - Payemnt Gateway ===================================

const payment = (request, response) => {

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-dsJ028IrXfmGmNWkYTVm-ubS',
    // clientKey : 'SB-Mid-client-WJzlg6BkIz6-e6GF'
  });

  const parameter = {
    "transaction_details": {
      "order_id": request.body.order_id,
      "gross_amount": request.body.amount,
      "time_order": request.body.time,
    },
    "credit_card": {
      "secure": true
    },
  };

  snap.createTransaction(parameter)
    .then((transaction) => {
      return response.status(200).send(transaction);
      const transactionToken = transaction.token;
    })

}

app.post('/payment', payment);



const emailSend = () => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'olshopmymall@gmail.com',
      pass: 'OlshopMyMall00'
    }
  })

  const mailOptions = {
    from: 'olshopmymall@gmail.com',
    to: 'webdesainnn@gmail.com',
    cc: 'webdesainnn@gmail.com',
    bcc: 'webdesainnn@gmail.com',
    subject: 'Terima kasih sudah berkunjung dan berbelanja di toko online kami...',
    html: `<h2>Pembayaran berhasil</h2>
            <br>
            <p>Terimakasih telah berbelanja di e-commerce kami. 
            <br>
            Semoga kamu senang dengan pelayan dan fitur dari kami.</p>
            <br>
            <small>M. Khoirul Huda - Owner from e-commerce(2020Year)</small>
          `
  }

  transporter.sendMail(mailOptions, function (err, response) {
    if (err) {
      console.log(err)
    }else {
      console.log(response)
    }
  });
}

app.post('/emailSend', emailSend)



const dataOrder = async (request, response) => {
  try {
    database.ref('/adds' + data.userId).push({
      order_id: request.order_id,
      gross_amount: request.gross_amount,
    })
    console.log('sukses masuk database')
  }
  catch (error) {
    console.log(error)
  }

}


app.get('/dataOrder', dataOrder);

// alternative way to create transactionToken
// snap.createTransactionToken(parameter)
//     .then((transactionToken)=>{
//         console.log('transactionToken:',transactionToken);
//     })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




