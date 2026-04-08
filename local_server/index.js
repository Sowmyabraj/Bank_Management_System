// var express = require('express');
// var app = express();

// app.use(express.json());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   next();
// });
 

// const customers = [
//   {
//     customerId: 1,
//     name: 'Sowmya B',
//     email: 'sowmya@bank.com',
//     phone: '9876543210',
//     password: 'Sowmya@123',
//     address: 'Chennai, India',
//     dob: '2000-05-10',
//     kycStatus: 'Verified',
//     accountStatus: 'Active'
//   }
// ];

// // app.get('/', (req, res)=>{
// //     res.json("server host is running");
// // })

// // app.post('/validateCustomer', (req, res) => {
// //     const body = req.body;
// //     console.log(req.body);
// //     const foundID = customers.some(record => (body.emailId === record.email) && (record.password === body.password));
// //     if (foundID) {
// //         return res.status(200).json({ 
// //           msg: 'you have successfully logged in' });
// //     } else {
// //         return res.status(401).json({ msg: 'you are not authorized' })
// //     }
// // });

// // app.listen(3000, ()=> console.log("server is running"))

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = 'mysecretkey';

// 🔹 Dummy DB (later replace with real DB)
const customers = [
  {
    customerId: 1,
    name: 'Sowmya B',
    email: 'sowmya@bank.com',
    password: bcrypt.hashSync('Sowmya@123', 8) // 🔐 hashed
  }
];

// 🔐 LOGIN API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = customers.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  // 🔑 Generate JWT
  const token = jwt.sign(
    { id: user.customerId },
    SECRET,
    { expiresIn: '1h' }
  );

  // ✅ Clean response (no password)
  return res.json({
    success: true,
    data: {
      token,
      user: {
        customerId: user.customerId,
        name: user.name,
        email: user.email
      }
    }
  });
});

app.listen(4000, () => console.log('Auth server running on 4000'));





