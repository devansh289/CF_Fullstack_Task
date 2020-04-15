/*=============================================
=                Devansh Sharma               =
=       Fullstack Internship Application      =
=============================================*/


addEventListener('fetch', event => {
  event.respondWith(fetchVariants(event.request))
})



// Function to fetch the two possible redirection URLs
async function fetchVariants(request) {

  //Retrieves Cookie if previously saved
  const cookie = request.headers.get('cookie')

  //Setup for additional response parameters
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/json' }
  }

  //Gets the 2 URLS at the 'api/variants'
  const [rawLinks] = await Promise.all([
    fetch('https://cfw-takehome.developers.workers.dev/api/variants', init),
  ])

  //Converts JSON to Array
  const urls = await rawLinks.json()

  return generateVariation(urls.variants, cookie)

}


//Function to generate the new random URL or one present in the Cookie
async function generateVariation(urls, cookie) {
  let val, group_url;

  //Redirect to original pages if Cookie present
  if (cookie && cookie.includes(`variant=1`)) {
    group_url = urls[0]
    val = 1
  } else if (cookie && cookie.includes(`variant=2`)) {
    group_url = urls[1]
    val = 2
  } else {
    //Generate new random page is no Cookie present
    val = Math.random() < 0.5 ? 1 : 2
    group_url = urls[val - 1]
  }


  //Setup for additional response parameters
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'text/html' }
  }

  //Fetch one of the variants
  const [variant] = await Promise.all([
    fetch(group_url, init),
  ])

  return modifyHTML(val, variant)
}

async function modifyHTML(val, variant) {

  //Setup for additional response parameters
  const responseInit = {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  }

  //Handlers for HTMLRewritter
  class titleHandler {
    element(e) {
      e.prepend("Welcome to ");
    }
  }

  class headingHandler {
    element(e) {
      e.prepend("You are viewing ");
    }
  }

  class textHandler {
    element(e) {
      e.setInnerContent('Hey, My name is Devansh, and this is my Cloudflare 2020 Summer Internship Application! This web application includes all the basic funtionality as well as the bonus features!');
    }
  }

  class linkHandler {
    element(e) {
      e.setAttribute('href', 'https://www.linkedin.com/in/devansh-sharma-01/');
      e.setInnerContent('Check out my LinkedIn');
    }
  }

  let rewriter = new HTMLRewriter()
    .on('title', new titleHandler())
    .on('h1#title', new headingHandler())
    .on('p#description', new textHandler())
    .on('a#url', new linkHandler());


  //Preforms the HTMLRewriter operation
  let res = new Response(rewriter.transform(variant).body, responseInit);

  //Sends the cookie back in the response
  myCookie = `variant=${val}; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Path='/';`
  res.headers.set('Set-Cookie', myCookie)

  return res
}
