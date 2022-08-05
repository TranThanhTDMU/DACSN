const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account')
const {google} = require('googleapis')
const {OAuth2} = google.auth
const client = new OAuth2("925372749044-6foob3s5elcv3invl18q8lo19d7h8cuj.apps.googleusercontent.com")

const tesst =async (req, res, next) => {
    try{
      const {tokenId} = req.body

      if(!tokenId) return

      const verify = await client.verifyIdToken({idToken:tokenId,audience:"925372749044-6foob3s5elcv3invl18q8lo19d7h8cuj.apps.googleusercontent.com"})
      
      const {email_verified,email,name,picture} = verify.payload
      

      if(!email_verified)  return res.status(500).json({msg: 'Email verification failed.'})

      if(email_verified){
          const user = await AccountModel.findOne({email:email})
          if(user){
            AccountModel.findOne({
              email: user.email,
            })
              .then(resData => {
                if (resData) {
                  const { _id, username, password, role } = resData
                  const token = jwt.sign({_id, username, password, role}, 'mb1o4er')
                  const userData = resData
          
                  res.json({
                    status: true,
                    user: userData,
                    token: token
                  })
                } else {
                  req.err = 'Account is not true!'
                  next('last')
                }
              })
          }else{
            const user = verify.payload
            const newInstance = new AccountModel({username:user.email,password:user.password,role:'user',firstName:user.family_name,lastName:user.given_name,email:email,image:user.picture,})
            newInstance.save(err => {
              if (err === null) {
                const { _id, username, password, role, firstName, lastName, email,image } = newInstance
                const token = jwt.sign({ _id, username:user.email, password:user.password, role:'user' }, 'mb1o4er')
                res.json({
                  status: true,
                  user: {
                    _id,
                    image,
                    email,
                    password,
                    username,
                    role,
                    firstName,
                    lastName,
                    token
                  }
                })
              } else {
                req.err = newInstance
                next('last')
              }
            })
          }

      }
      
  }catch(err){
      return res.status(500).json({msg: err.message})
  }
}

module.exports = tesst
