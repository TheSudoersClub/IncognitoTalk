const chatBox = document.getElementById("chats");


// calculator bot
async function calculator(parsedMessage, parsedUsername, data, ) {

  let expression = await parsedMessage.replace(/^@\S+\s/, "");

  fetch(`https://incognitotalk-bots.onrender.com/calculate?expression=${encodeURIComponent(expression)}`)
    .then(response => response.text())
    .then(data => {
      chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
      chatBox.innerHTML += `<div class="send-message"><span class="username">Calculator : &nbsp;</span>${data} </div>`;
      scrollToBottom();
    })
    .catch(error => console.error(error));
}

// translator bot
async function translator(parsedMessage, parsedUsername) {

  let message = await parsedMessage.replace(/^@\S+\s/, "");

  let words = await message.split(" ");
  let translateLang = await words[0];
  let translateText = await words.slice(1).join(" ");

  // convert language in 2 letter code
  translateLang = get2LetterCode(translateLang);

  var url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${translateLang}&dt=t&q=${encodeURI(translateText)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
      chatBox.innerHTML += `<div class="send-message"><span class="username">Translator : &nbsp;</span>${data[0][0][0]} </div>`;
      scrollToBottom();
    })
    .catch(error => {
      console.error(error);
    });
}


// compiler bot (c/c++, python, java)
async function compiler(parsedMessage, parsedUsername) {

  const supportedLanguages = ["c", "cpp", "python", "java"];

  let message = await parsedMessage.replace(/^@\S+\s/, "");

  // programming language 
  let words = await message.split(" ");
  let programmingLang = await words[0].toLowerCase();
  programmingLang = programmingLang.split("<br>")[0];

  // code to compile
  code = await words.slice(1).join(" ");
  code = await parseHTML(code);

  // input for code
  let input = ''

  console.log(programmingLang)
  if (supportedLanguages.includes(programmingLang)) {


    // alternate names for some languages
    if (programmingLang === 'c' || programmingLang === 'c++') {
      programmingLang = await "cpp";
    } else if (programmingLang === 'py') {
      programmingLang = await "python"
    }

    fetch(`http://147.185.221.223:26819/compiler?lang=${encodeURIComponent(programmingLang)}&input=${encodeURIComponent(input)}&code=${encodeURIComponent(code)}`)

      .then(res => res.json())
      .then(async (data) => {
        // wrap message in pre and code elements
        code = await stringifyHTML(code);
        chatBox.innerHTML += `<span class="username">${parsedUsername} : &nbsp;</span>@compiler ${programmingLang.trimStart()}<pre class="code-block"><code class="language-javascript">${code}</code></pre>`;
        chatBox.innerHTML += `<div class="send-message"><span class="username">${programmingLang} : &nbsp;</span><br>Output: ${data.stdout}<br>Error: ${data.stderr}<br>Status: ${data.statusMes}  </div>`;

        Prism.highlightAll();

        scrollToBottom();
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
    chatBox.innerHTML += `<div class="send-message"><span class="username">Compiler : &nbsp;</span><br>Programming language not supported<br>Usage: @compiler [c, cpp, python, java] [code]</div>`;
  }

}


// convert language name into 2 letter code
function get2LetterCode(fullLanguageName) {
  const ISO_639_1 = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Burmese',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ny': 'Chichewa',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu',
  };

  for (const code in ISO_639_1) {
    if (ISO_639_1[code].toLowerCase() === fullLanguageName.toLowerCase()) {
      return code;
    }
  }
  return null;
}