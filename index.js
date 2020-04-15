/**
 * Respond with hello worker text
 * @param {Request} request
 */


addEventListener('fetch', event => {
  event.respondWith(fetchVariants(event.request))
})

async function fetchVariants(request) {

  const cookie = request.headers.get('cookie')
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/json' }
  }

  const [rawLinks] = await Promise.all([
    fetch('https://cfw-takehome.developers.workers.dev/api/variants', init),
  ])

  const urls = await rawLinks.json()

  return generateVariation(urls.variants, cookie)

}


async function generateVariation(urls, cookie) {
  let val, group_url;

  if (cookie && cookie.includes(`variant=1`)) {
    group_url = urls[0]
    val = 1
  } else if (cookie && cookie.includes(`variant=2`)) {
    group_url = urls[1]
    val = 2
  } else {
    val = Math.random() < 0.5 ? 1 : 2
    group_url = urls[val - 1]
  }



  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' }
  }

  const [variant] = await Promise.all([
    fetch(group_url, init),
  ])


  return modifyHTML(variant.body, val)
}

async function modifyHTML(textBody, val) {
  const responseInit = {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  }
  myCookie = `variant=${val}; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Path='/';`

  res = new Response(textBody, responseInit)
  res.headers.set('Set-Cookie', myCookie)

  return res
}
