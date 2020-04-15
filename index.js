/*=============================================
=                Devansh Sharma               =
=       Fullstack Internship Application      =
=============================================*/


addEventListener('fetch', event => {
  event.respondWith(fetchVariants(event.request))
})


// Function to fetch the two possible redirection URLs
async function fetchVariants(request) {

  //Retrieve cookie 
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


  return modifyHTML(variant.body, val, variant)
}

async function modifyHTML(textBody, val, variant) {
  const responseInit = {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  }


  class titleHandler {
    element(e) {
      e.prepend("Welcome to ");
    }
  }

  /**
   * Element handler to handle title of card
   */
  class headingHandler {
    element(e) {
      e.prepend("You are viewing ");
    }
  }

  /**
   * Element handler to handle description
   */
  class textHandler {
    element(e) {
      e.setInnerContent('Hey, My name is Devansh, and this is my Cloudflare 2020 Summer Internship Application! This web application includes all the basic funtionality as well as the bonus features!');
    }
  }

  /**
   * Element handler to handle link
   */
  class linkHandler {
    element(e) {
      e.setAttribute('href', 'http://devansh.site/');
      e.setInnerContent('Check out my Portfolio');
    }
  }
  let rewriter = new HTMLRewriter()
    .on('title', new titleHandler())
    .on('h1#title', new headingHandler())
    .on('p#description', new textHandler())
    .on('a#url', new linkHandler());


  let res = new Response(rewriter.transform(variant).body, responseInit);

  myCookie = `variant=${val}; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Path='/';`
  res.headers.set('Set-Cookie', myCookie)

  return res
}
