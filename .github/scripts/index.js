const axios = require('axios')
const sodium = require('libsodium-wrappers')
const jwt = process.argv[2]
const key = process.env.REPO_PUBLIC_KEY
const pat = process.env.PAT
const keyid = new String(process.env.KEY_ID)
const apiroot = new String("https://api.github.com")

function create_sec(token)
{
return sodium.ready.then(()=>{
let ikey=sodium.from_base64(tk,sodium.base64_variants.ORIGINAL)
let res=sodium.crypto_box_seal(token,ikey)
let q=sodium.to_base64(res,sodium.base64_variants.ORIGINAL)
return q
})
}

function update_token()
{
 let config={}
 config.method='get'
 config.url=apiroot.concat('/app/installations')
 config.headers={'Authorization':'Bearer '+jwt}
 axios(config)
 .then(installs=>{let config={}
 console.log(installs)
config.method='post'
config.url=apiroot.concat('/app/installations/'+installs[0].id+'/access_tokens')
config.data={}
config.headers={'Authorization':'Bearer '+jwt}
 axios(config).then(token=>{
       create_sec(token.token).then(enc_token=>{
            let config={}
            config.method='put'
            config.url=apiroot.concat('/repos/thispsj/update-forks/secrets/APP_TOKEN')
            config.data={encrypted_value:enc_token,key_id:keyid}
            config.headers={'Authorization':'token '+pat}
            axios(config).then(()=>{
             console.log('Done!')
            })
        })
   })
  })
}

update_token();
