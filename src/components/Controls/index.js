module.exports = function connect (client, map, player) {
  // map.easeTo({zoom:23})
  console.log('zoom', map.getZoom())
  client.record.getRecord(`player/${player}`).whenReady(record => {
    record.set({
      name: player,
      pos: [map.getCenter().lng, map.getCenter().lat],
      bearing: -9.47
    })

    // client.event.subscribe(`status/${player}`, () => {})
    // Interact with the record here
    var marker
    var delta = 100

    function easeTo (t) {
      if (marker && t === 1) marker.remove()
      return t * (2 - t)
    }

    function move (pos, bearing) {
      // console.log(pos, bearing)
      if (bearing) {
        map.easeTo({
          bearing: pos,
          easing: easeTo
        })
      } else {
        map.panBy(pos, {
          easing: easeTo
        })
      }
      // console.log([map.getCenter().lng, map.getCenter().lat])
      record.set(
        'pos', [map.getCenter().lng, map.getCenter().lat]
      )
    }

    function goDirection (dir) {
      switch (dir) {
        case 'left':
          move(map.getBearing() - 25, true)
          break
        case 'right':
          move(map.getBearing() + 25, true)
          break
        case 'up':
          move([0, -delta])
          break
        case 'down':
          move([0, delta])
          break
      }
    }

    window.addEventListener('keydown', function (e) {
      switch (e.which) {
        case 38: // up
          goDirection('up')
          break
        case 40: // down
          goDirection('down')
          break
        case 37: // left
          goDirection('left')
          break
        case 39: // right
          goDirection('right')
          break
      }
    }, true)

    var compass = document.querySelector('.js-compass')
    map.on('rotate', function () {
      var rotate = 'rotate(' + (map.transform.angle * (180 / Math.PI)) + 'deg)'
      compass.style.transform = rotate
    })

    // var buttonLeft = ['left', document.querySelector('.js-left')]
    // var buttonRight = ['right', document.querySelector('.js-right')]
    // var buttonTop = ['up', document.querySelector('.js-up')]
    // var buttonBottom = ['down', document.querySelector('.js-down')]

    // var buttons = [buttonLeft, buttonRight, buttonTop, buttonBottom]
    // var persist

    // function buttonStart (b) {
    //   persist = setInterval(function () {
    //     goDirection(b[0])
    //   }, 20)
    // }

    // function buttonEnd () {
    //   clearInterval(persist)
    // }

    // buttons.forEach(function (b) {
    //   //b[1].addEventListener('mousedown', buttonStart.bind(this, b))
    //   b[1].addEventListener('touchstart', buttonStart.bind(this, b))
    //   //b[1].addEventListener('mouseup', buttonEnd.bind(this, b))
    //   b[1].addEventListener('touchend', buttonEnd.bind(this, b))
    // })

    function createMarker (e) {
      var markerEl = document.createElement('div')
      var dot = document.createElement('div')
      dot.className = 'waypoint-dot'
      var shadow = document.createElement('div')
      shadow.className = 'waypoint-shadow'
      markerEl.appendChild(dot)
      markerEl.appendChild(shadow)
      marker = new mapboxgl.Marker(markerEl).setLngLat(e.lngLat).addTo(map)

      window.setTimeout(function () {
        map.flyTo({
          center: e.lngLat,
          easing: easeTo
        })
      }, 500)
      record.set(
        'pos', [e.lngLat.lng, e.lngLat.lat]
      )
    }

    // map.on('click', createMarker)
    // map.on('touchstart', createMarker)
  })
}