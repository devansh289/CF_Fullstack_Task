/*html = `<html><body><div>Ayeedejndkdednkdejk</div></body></html>`


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})*/

/**
 * Respond with hello worker text
 * @param {Request} request
 */

/*async function handleRequest(request) {
  return new Response(html, {
    headers: { 'Content-type': 'text/html' },
  })
}*/


/*async function handleRequest(request) {
  console.log("1")
  //await getURL()
  console.log("2")
  const res = await getUserAsync(
    "devansh289"
  )
  const res2 = await res.json()
  console.log(res)
  //getUserAsync().then(data => console.log("Edede"));
  console.log("3")
  return new Response(res2, {
    headers: { 'Content-type': 'text/plain' },
  })
}
*/
/*
const data = { username: 'example' };
async function getURL() {
  fetch('https://cfw-takehome.developers.workers.dev/api/variants', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => console.log(response))
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}*/
/*
async function getURL() {
  console.log("LOL")
  await fetch('https://httpbin.org/get').then((response) => console.log(response))


  async function getUserAsync() {
    let response = await fetch(`https://httpbin.org/get`);
    let data = await response.json()
    return data;
  }

  getUserAsync('yourUsernameHere')
    .then(data => console.log("Edede"));
}*/
/*
async function getUserAsync(name) {
  try {
    let response = await fetch(`https://api.github.com/users/${name}`);
    let lol = response.json()
    console.log(lol)
    console.log("2112")
    console.log("Deed")
    return await response;
  } catch (err) {
    console.error(err);
    console.log("ERRROROROORRO")
  }
}*/










addEventListener('fetch', event => {
  event.respondWith(fetchVarients(event.request))
})

async function fetchVarients(request) {
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/json' }
  }
  const [raw_links] = await Promise.all([
    fetch('https://cfw-takehome.developers.workers.dev/api/variants', init),
  ])

  const links = await raw_links.json()
  const redirect_link = links.variants

  return generateVariation(redirect_link)

}

async function generateVariation(urls) {
  const group = Math.random() < 0.5 ? urls[0] : urls[1]

  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' }
  }

  const [variant_raw] = await Promise.all([
    fetch(group, init),
  ])
  variant = await variant_raw

  const responseInit = {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  }
  return new Response(variant.body, responseInit)
}