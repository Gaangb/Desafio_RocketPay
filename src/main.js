import "./css/index.css" //importa o que tem no css para o js. o css nao precisa ser chamado no html desta forma
import IMask from "imask" //  importa a biblioteca do imask

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") // declara que essa const é o que o querrySelector pegou
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path") // declara que essa const é o que o querrySelector pegou
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img") // declara que essa const é o que o querrySelector pegou

function setCardType(type) { // essa é uma function que vai dar cor ao cartao
  const colors = { // essa const é um obj que guarda as cores de cada cartao
    visa: ["#436D99", "#2D57F2"], // essa array guarda as cores do visa. posicao 0 e 1
    mastercard: ["#DF6F29", "#C69347"], // essa array guarda as cores do mastercard. posicao 0 e 1
    elo: ["#751414", "#0012B5"], // essa array guarda as cores do elo. posicao 0 e 1
    default: ["black", "gray"], // essa array guarda as cores do default. posicao 0 e 1
  }

  ccBgColor01.setAttribute("fill", colors[type][0]) // essa const vai alterar o atributo fill(cor) dela,  de acordo com o tipo que vai receber e usar a cor da posicao 0 da array da const colors
  ccBgColor02.setAttribute("fill", colors[type][1]) // essa const vai alterar o atributo fill(cor) dela,  de acordo com o tipo que vai receber e usar a cor da posicao 1 da array da const colors
  ccLogo.setAttribute("src", `cc-${type}.svg`) // essa const vai alterar o atributo src dela e fazer a logo do cartao mudar, de acordo com o tipo que vai receber, pois o type vai entrar com o nome na busca da imagem que esta guardada na pasta
}

globalThis.setCardType = setCardType // esta linha torna o setcardtype glogal. isso é muito necessario para que tudo aconteca, e ela vai receber ela mesma

                          //AQUI COMEÇA O IMASK

const securityCode = document.querySelector("#security-code") // Essa const é o que a queryselector pegou
const securitycodePattern = { //esse objeto é o que define como será a mask.
  mask: "0000", //determina que a mask será com 4 digitos. é necessario que o nome seja mask
}
const securityCodeMasked = IMask(securityCode, securitycodePattern) // aqui a const esta recebendo um valor com o IMask(const de onde esta puxando, qual modelo deve seguir)

const expirationDate = document.querySelector("#expiration-date") // Essa const é o que a queryselector pegou
const expirationDatePattern = { //esse objeto é o que define como será a mask.
  mask: "MM{/}YY", //determina que a mask seguira este padrao que sera defino como vai seguir no blocks abaixo. necessario colocar a / entre chaves para entrar automatico. é necessario que o nome seja mask
  blocks: { // é onde vai definir o comportamento de cada bloco da estrutura do mask
    YY: { // comportamento do YY
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: { // comportamento do MM
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function(item){

      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => { // fica de olho se o evento de click vai acontecer
  console.log("opa, vc clicou")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", ()=>{
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length === 0? "FULANO DA SILVA" : cardHolder.value
})


securityCodeMasked.on("accept", ()=>{
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length ===0? "123" : code
}

cardNumberMasked.on("accept",()=>{  //checa se a funcao do cardnumbermasked foi aceito com esta funcao aerea que deve ser feita dessa forma com o on e o accept
  const cardType = cardNumberMasked.masked.currentMask.cardtype // sendo aceita ele faz: a const cardtype acessa o function cardnumbermasked, acessa a mask, depois pega a mask atual e o card type que foi recebido
  setCardType(cardType) // passa para a funcao setcardtype o que foi recebido da const cardtype
  updateCardNumber(cardNumberMasked.value) // esta passando o valor digitado na cardnumbermasked para a funcao updatecardnumber
})

function updateCardNumber(number){ // essa function recebe o que foi digitado la na cardnumbermasked
  const ccNumber = document.querySelector(".cc-number") // esta recebendo os numeros que estao escritos na class do cartao html
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number // essa parte é um ternario que vai escrever la no cartao, so que antes ele verifica se o tamanho que ta escrito la e zero, se for vai aparecer um numero padrao, se nao vai aparecer o numero passado pelo updatecardnumber
}

expirationDateMasked  .on("accept", ()=>{  //checa se a funcao do expirationDate foi aceito com esta funcao aérea e que deve ser feita dessa forma com o on e o accept
  updateExpirationDate(expirationDate.value) // esta passando para a function updateExpirationDate ali debaixo o valor que tem no expirationdate
})

function updateExpirationDate(date){ // eesa function recebe o que foi digitado la de expirationdate
  const ccExpiration = document.querySelector(".cc-extra .value") // esta recebendo os numeros que estao escritos la do cartao html
  ccExpiration.innerText = date.length === 0 ? "02/32" : date // essa parte é um ternario que vai escrever la no cartao, so que antes ele verifica se o tamanho que ta escrito la e zero, se for vai aparecer um numero padrao, se nao vai aparecer o numero passado pelo updateExpirationDate
}