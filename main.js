let context_id = -1;

let commitSpaceOnRelease = false
let isSpace = false
let isCtrl = false
let isShift = false

function pos1() {
  sendEvent('End')
  sendEvent('Enter')
  sendEvent('KeyZ')
  sendEvent('Home', true)
  sendEvent('Home', true)
  sendEvent('Delete')
  sendEvent('Delete')
  sendEvent('ArrowUp')
}

function cutLine() {
  pos1()
  sendEvent('ArrowDown', true)
  sendEvent('KeyX', false, true)
}

function pasteLine() {
  sendEvent('KeyV', false, true)
  sendEvent('ArrowUp')
  sendEvent('Home')
}

function sendEvent(code, isShift = false, isCtrl = false) {
  const keyData = {
    'type': 'keydown',
    'altKey': false,
    'ctrlKey': isCtrl,
    'shiftKey': isShift,
    'key': code,
    'code': code
  };

  chrome.input.ime.sendKeyEvents({
    'contextID': context_id,
    'keyData': [keyData]
  });
}

chrome.input.ime.onFocus.addListener(function(context) {
  context_id = context.contextID;
});

chrome.input.ime.onBlur.addListener(function(context) {
  contextId = -1;
});

chrome.input.ime.onKeyEvent.addListener(
  function(engineID, keyData) {
    console.log(keyData.code)

    if (keyData.type === 'keyup') {
      switch (keyData.code) {
        case 'KeyF':
          isCtrl = false
          return false

        case 'KeyD':
          isShift = false
          return false

        case 'Space':
          isSpace = false

          if (commitSpaceOnRelease === true) {
            chrome.input.ime.commitText({
              'contextID': context_id,
              'text': ' '
            });
            return true
          }

          return false
      }
    }

    if (keyData.type === 'keydown') {
      switch (keyData.code) {
        case 'Space':
          isSpace = true
          commitSpaceOnRelease = true
          return true
      }
    }

    if (keyData.type === 'keydown' && isSpace === true) {
      commitSpaceOnRelease = false

      switch (keyData.code) {
        case 'KeyF':
          isCtrl = true
          return true

        case 'KeyD':
          isShift = true
          return true

        case 'KeyJ':
          sendEvent('ArrowLeft', isShift, isCtrl);
          return true

        case 'KeyL':
          sendEvent('ArrowRight', isShift, isCtrl);
          return true

        case 'KeyI':
          if (isCtrl) {
            cutLine()
            sendEvent('ArrowUp')
            pasteLine()

          } else {
            sendEvent('ArrowUp', isShift);
          }
          return true

        case 'KeyK':
          if (isCtrl) {
            cutLine()
            sendEvent('ArrowDown')
            pasteLine()

          } else {
            sendEvent('ArrowDown', isShift);
          }
          return true

        case 'KeyU':
          sendEvent('Backspace', false, isCtrl);
          return true

        case 'KeyO':
          sendEvent('Delete', isShift, isCtrl);
          return true

        case 'KeyH':
          sendEvent('Home', isShift, isCtrl)
          return true

        case 'KeyN':
          sendEvent('End', isShift, isCtrl)
          return true

        case 'Semicolon':
            console.log(isShift)
          if (isCtrl) {
            cutLine()
            pasteLine()
            pos1()
            pasteLine()
            sendEvent('ArrowDown')
            sendEvent('End')
          } else {
              sendEvent('Enter')
          }
          return true

        case 'KeyQ':
          sendEvent('Escape')
          return true

        case 'KeyA':
          sendEvent('KeyZ', false, true)
          return true

        case 'KeyS':
          sendEvent('KeyY', false, true)
          return true

        default:
          return false
      }
    }

    return false
  }
)