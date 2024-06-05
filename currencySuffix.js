//Скрипт следует подключить на странице с рассчетом стоимости импорта внутри body в самом конце (тогда форма точно будет отрисована, и скрипт сможет найти элементы)

// находим элемент выпадающего списка с валютой
// находим поле с таможенным сбором (это необходимо, так как поле работает не так, как остальные поля, нужен доп обработчик событий):
//     при появлении значения суффикс валюты отсутствует.
//     когда значение становится равным 30000, появляется суффикс ' ₽' вне зависимости от текущей валюты.
const select = document.getElementById("form11_dropdown14");
const customsFee = document.getElementById('form11_text16');
//если оба элемента существуют на странице, работаем над корректным отображение суффиксов
if(select && customsFee) {
    //для удобства объявляем константы с суффиксами
    const RUB = ' ₽';
    const EUR = ' €';
    const USD = ' $';
    //собираем массив из всех полей, где необходима замена суффикса
    const outputs = [
        document.getElementById('form11_text15'),
        document.getElementById('form11_text16'),
        document.getElementById('form11_text17'),
        document.getElementById('form11_text18'),
    ];
    //объявляем переменную для хранения текущей валюты
    let currency = select.value;
    //объявляем обработчик события для изменение валюты 
    function applyNewCurrency() {
        //присваиваем значение текущей валюты, которое получит обработчик при срабатывании события change
        currency = this.value;
        //вызываем функцию изменения суффикса при срабатывании события change
        changeSuffix(currency);
    }
    //щбъявляем функцию для изменения суффикса (запустим внутри обработчика события change)
    function changeSuffix(currency) {
        //взависимости от текущего значения валюты, проходимся по массиву outputs
        //элементы, имеющие аттрибут data-suffix будут получать новое значение для этого аттрибута и для value
        //элемент без аттрибута data-suffix будет получать новое значение для value
        //так как поле с таможенным сбором изначально пусто, добавлять один суффикс не имеет смысла, поэтому суффикс будет присваиваться в отдельном обработчике событий 
        //для поля "таможенный сбор"
        if(currency === 'Руб.'){
            outputs.forEach((output)=> {
              if(output.dataset.suffix) {
                output.dataset.suffix = RUB;
                output.value = parseInt(output.value) + output.dataset.suffix;
              } else if(output.value) {
                output.value = parseInt(output.value) + RUB;
              }
            })
          }
          if(currency === 'EUR') {
            outputs.forEach((output)=> {
              if(output.dataset.suffix){
                output.dataset.suffix = EUR;
                output.value = parseInt(output.value) + output.dataset.suffix;
              } else if(output.value) {
                output.value = parseInt(output.value) + EUR;
              }
            })
          }
            if(currency === 'USD') {
              outputs.forEach((output)=> {
                if(output.dataset.suffix) {
                  output.dataset.suffix = USD;
                  output.value = parseInt(output.value) + output.dataset.suffix;
                } else if(output.value) {
                  output.value = parseInt(output.value) + USD;
                }
              })
            }
    }
    //объявляем обработчик событий для изменения суффикса валюты в поле "таможенный сбор"
    function fixCustomsFeeField() {
        //если значение появилось, проверяем, есть ли в нем суффикс.
        //если суффикс отсутствует или он равен ' ₽' (что может являться неподходящим суффиксом),
        //смотрим значение текущей валюты в переменной currency, и вставляем нужный суффикс
        if(this.value){
          const isSuffix = this.value.includes(USD) || this.value.includes(RUB) || this.value.includes(EUR);
            if (!isSuffix || (this.value.includes(RUB) && currency!== 'Руб.')) {
                switch(currency) {
                    case 'Руб.':
                    this.value = parseInt(this.value) + RUB;
                    break;
                    case 'EUR':
                    this.value = parseInt(this.value) + EUR;
                    break;
                    case 'USD':
                    this.value = parseInt(this.value) + USD;
                    break;
                }
            }
        }
    };
    
    //вешаем обработчики событий на элементы выпадающего списка и поля с таможенным сбором
    select.addEventListener('change', applyNewCurrency);
    customsFee.addEventListener('change', fixCustomsFeeField);

};