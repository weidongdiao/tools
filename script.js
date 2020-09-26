$(() => {

  let $theme = $(".theme"),
      $audio = $("audio"),
      $title = $("#title"),
      $controls = $("#controls"),
      $options = $("#options"),
      $minutes = $("#minutes"),
      $seconds = $("#seconds"),
      $start = $("#start"),
      $pause = $("#pause"),
      $reset = $("#reset"),
      $incrSession = $("#incrSession"),
      $sessionInput = $("#sessionInput"),
      $decrSession = $("#decrSession"),
      $incrBreak = $("#incrBreak"),
      $breakInput = $("#breakInput"),
      $decrBreak = $("#decrBreak"),
      breakLength = 5 * 60,
      breakMax = 30,
      breakMin = 1,
      sessionLength = 30 * 60,
      sessionMax = 180,
      sessionMin = 0,
      sessionNum = 0,
      countdown,
      countType,
      remainingTime = sessionLength;
      $lucky = $("#lucky"),
      $luckyInput = $("#luckyInput"),
      $luckyOptions = $(".luckyOptions")
      $generate = $("#generate"),
      curInputId = ''

  init();

  function init(){
    $audio.prop("volume", 0);
    $incrSession.click(() => incrSession());
    $decrSession.click(() => decrSession());
    $incrBreak.click(() => incrBreak());
    $decrBreak.click(() => decrBreak());
    $sessionInput.on("change", e => updateSession(e.target.value));
    $sessionInput.on("click", () => showKeyboard('session'));
    $breakInput.on("change", e => updateBreak(e.target.value));
    $breakInput.on("click", () => showKeyboard('break'));
    $start.click(() => { if (countType === "break"){ startBreak(); } else { startSession(); } });
    $pause.click(() => pause());
    $reset.click(() => reset());
    $generate.click(() => generate());
    $theme.click(e => audioSelect(e));
    $luckyInput.on("change", e => updateLucky(e.target.value));
    $luckyInput.on("click", () => showKeyboard('lucky'));
    window.keyboard = keyboard
  }
  function startSession(){
    sessionNum++;
    countType = "session";
    $options.slideUp(143);
    $controls.removeClass().addClass("started");
    $title.fadeOut(43, function(){
      $(this).html("第 " + sessionNum + " 阶段").fadeIn();
    });
    start(remainingTime || sessionLength);
    const ele = document.getElementById('keyboard')
    ele.setAttribute('style', 'display: none')
  }
  function startBreak(){
    countType = "break";
    $title.fadeOut(43, function(){
      $(this).html("第 " + sessionNum + " 次休息").fadeIn();
    });
    $audio.animate({volume: 0}, 1000);
    start(remainingTime || breakLength);
  }
  function start(timeLeft){
    clearInterval(countdown);
    countdown = setInterval(() => {
      timeLeft--;
      remainingTime = timeLeft;
      let minLeft = Math.floor(timeLeft / 60),
          secLeft = timeLeft - minLeft * 60;
      updateMinutes(minLeft);
      updateSeconds(secLeft < 10 ? "0" + secLeft : secLeft);
      if (timeLeft < 30) {
        $audio.animate({volume: 1}, 1000);
      }
      if (timeLeft < 1){
        if (countType === "session"){
          startBreak(breakLength);
        } else {
          startSession();
        }
      }
    }, 1000);
  }
  function pause(){
    sessionNum--;
    $audio.animate({volume: 0}, 1000);
    clearInterval(countdown);
    $options.slideDown(143);
    $controls.removeClass().addClass("paused");
    $title.fadeOut(43, function(){
      $(this).html("Paused").fadeIn();
    });
  }
  function reset(){
    clearInterval(countdown);
    updateMinutes(sessionLength / 60);
    updateSeconds("00");
    countType = undefined;
    $controls.removeClass().addClass("reset");
    $title.html("Ready?");
    remainingTime = sessionLength;
  }
  function incrSession(){
    let num = Number($sessionInput.val());
    num = num + (num === sessionMax ? 0 : 1);
    sessionLength = num * 60;
    updateSession(num);
    updateMinutes(num);
    updateSeconds("00");
    reset();
  }
  function decrSession(){
    let num = Number($sessionInput.val());
    num = num - (num === sessionMin ? 0 : 1);
    sessionLength = num * 60;
    updateSession(num);
    updateMinutes(num);
    updateSeconds("00");
    reset();
  }
  function incrBreak(){
    let num = Number($breakInput.val());
    num = num + (num === breakMax ? 0 : 1);
    breakLength = num * 60;
    updateBreak(num);
    reset();
  }
  function decrBreak(){
    let num = Number($breakInput.val());
    num = num - (num === breakMin ? 0 : 1);
    breakLength = num * 60;
    updateBreak(num);
    reset();
  }
  function updateMinutes(num){
    $minutes.text(num);
  }
  function updateSeconds(num){
    $seconds.text(num);
  }
  function updateSession(num){
    num = num < sessionMin ? sessionMin : num > sessionMax ? sessionMax : num;
    $sessionInput.val(num).blur();
    updateMinutes(num);
    updateSeconds("00");
    sessionLength = num * 60;
    reset();
  }
  function updateBreak(num){
    $breakInput.val(num < breakMin ? breakMin : num > breakMax ? breakMax : num).blur();
    breakLength = num * 60;
    reset();
  }
  function generate() {
    const max = $luckyInput.val()
    const luckyNum = Math.round(Math.random() * (max - 1)) + 1;
    $lucky.text(luckyNum);
    $luckyOptions.slideUp(143);
    const ele = document.getElementById('keyboard')
    ele.setAttribute('style', 'display: none')
    
  }
  function updateLucky (num){
    $luckyInput.val(num).blur();
  }

  function showKeyboard(type) {
    console.log(type)
    curInputId = `${type}Input`
    const ele = document.getElementById('keyboard')
    ele.setAttribute('style', 'display: inline-block')
  }
  function keyboard(obj,tip){
    let value = ''
    if(tip === 1 ) {
      var con=document.getElementById(curInputId).value;
      value = con+obj.innerHTML
      document.getElementById(curInputId).value= value;
      if (curInputId === 'sessionInput') {
        updateSession(+value);
      }
    } else if(tip === 2) {
      document.getElementById(curInputId).value="";
      if (curInputId === 'sessionInput') {
        updateSession(0);
      }
    } else if(tip === 3) {
      var con=document.getElementById(curInputId).value;
      value = con.slice(0,-1);
      document.getElementById(curInputId).value=value;
      if (curInputId === 'sessionInput') {
        updateSession(+value);
      }
    }
  }

});
