var CycleLove = {}

// CycleLove.AvatarGenerator ViewController
CycleLove.AvatarGenerator = function(options) {
  this.options = $.extend({}, this.options, options)
  this.initialize()
}
$.extend(CycleLove.AvatarGenerator.prototype, {

  options: {
    colors: 'red green blue gold brown silver grey black white'.split(' '),
    bikes: [
      'road-bike.svg',
      'brompton.svg',
      'bmx.svg'
    ],
    size: 512
  },

  bikes: {},

  initialize: function() {
    this.el = $(this.options.el)
    this.el.css({ textAlign: 'center' })

    var self = this

    this.loadBikes().then(function() {
      self.canvas = self.createCanvas().appendTo(self.el)
      self.colorPalette = self.createColorPalette().appendTo(self.el)
      self.bikePalette = self.createBikePalette().appendTo(self.el)
      self.saveButton = self.createSaveButton().appendTo(self.el)

      self.el.on('click', '[role="bike-palette"] > *', function(e) {
        e.preventDefault()
        self.didClickBike($(this))
      })

      self.el.on('click', '[role="color-palette"] > *', function(e) {
        e.preventDefault()
        self.didClickColor($(this))
      })

      self.el.on('click', '[role="canvas"] > svg *', function(e) {
        e.preventDefault()
        self.didClickPart($(this))
      })

      self.el.on('click', '[role="save"]', function(e) {
        e.preventDefault()
        self.save()
      })
    })
  },

  didClickBike: function(button) {
    this.bikePalette.children().css({ webkitTransform: 'scale(0.75)' })
    button.css({ webkitTransform: 'scale(1)' })

    this.canvas.html(
      this.bikes[button.data('url')].clone()
      .attr('width', this.options.size)
      .attr('height', this.options.size)
    )

    this.canvas.find('svg *').css({ cursor: 'pointer' })
    this.canvas.find('svg').css({ display: 'block' })

    this.colorPalette.show()
    this.saveButton.show()
  },

  didClickColor: function(button) {
    this.color = button.data('color')
    this.colorPalette.children().css({ webkitTransform: 'scale(0.75)' })
    button.css({ webkitTransform: 'scale(1)' })
  },

  didClickPart: function(part) {
    if (!this.color) return

    if (part.attr('id') === 'background') {
      part.attr('fill', this.color)
    } else {
      part.attr('stroke', this.color)
    }
  },

  loadBikes: function() {
    var self = this

    return $.when.apply($,
      $.map(self.options.bikes, function(url, index) {
        return $.get(url).then(function(data) {
          self.bikes[url] = $(data).find('svg').clone()
        })
      })
    )
  },

  createCanvas: function() {
    return $('<div role="canvas">')
  },

  createBikePalette: function() {
    var urls = this.options.bikes,
        bikes = this.bikes,
        size = this.options.size,
        count = urls.length,
        margin = 8,
        buttonSize = (size - (margin * (count - 1))) / count,
        palette = $('<div role="bike-palette">')

    palette.css({
      overflow: 'hidden',
      marginTop: '16px'
    })

    $.each(urls, function(index, url) {
      bikes[url]
      .clone()
      .data('url', url)
      .attr('width', buttonSize)
      .attr('height', buttonSize)
      .css({
        cursor  : 'pointer',
        display : 'block',
        float   : 'left',
        margin  : '0 ' + margin + 'px 0 0'
      })
      .appendTo(palette)
    })

    palette.find('*:last-child').css({ marginRight: 0 })

    return palette
  },

  createColorPalette: function() {
    var colors = this.options.colors,
        size = this.options.size,
        count = colors.length,
        margin = 8,
        buttonSize = (size - (margin * (count - 1))) / count,
        palette = $('<div role="color-palette">')

    palette.css({
      overflow: 'hidden',
      marginTop: '16px'
    })

    $.each(colors, function(index, color) {
      $('<button>')
      .data('color', color)
      .css({
        appearance   : 'none',
        background   : color,
        border       : '3px solid rgba(0, 0, 0, 0.25)',
        borderRadius : (buttonSize / 2) + 'px',
        boxSizing    : 'border-box',
        cursor       : 'pointer',
        display      : 'block',
        float        : 'left',
        height       : buttonSize + 'px',
        margin       : '0 ' + margin + 'px 0 0',
        width        : buttonSize + 'px',
      })
      .appendTo(palette)
    })

    palette.find('*:last-child').css({ marginRight: 0 })

    palette.hide()

    return palette
  },

  createSaveButton: function() {
    return $('<button role="save">Save</button>')
    .css({
      background   : 'black',
      color        : 'white',
      border       : 'none',
      padding      : '0.5em 1.5em',
      borderRadius : '30px',
      marginTop    : '1.5em',
      display      : 'none'
    })
  },

  save: function() {
    var svg = this.canvas.find('svg').clone()
    svg.width(1024).height(1024)
    svg = $('<div>').append(svg).html()

    var canvas = document.createElement('canvas')
    canvas.width = '1024px'
    canvas.height = '1024px'

    canvg(canvas, svg)

    var img = $('<img>')
    .attr('src', canvas.toDataURL('image/png'))
    .css({
      display: 'block',
      width: '512px', height: '512px'
    })

    var container = $('<div role="container">')
    .append(img)
    .css({
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      position: 'absolute',
      left: '50%', top: '50%',
      marginLeft: '-272px', marginTop: '-272px',
      textAlign: 'center'
    })
    .append('<p>Drag this image to your desktop. Have fun.</p>')

    var overlay = $('<div role="overlay">')
    .css({
      position: 'fixed',
      background: 'rgba(0, 0, 0, 0.75)',
      top: 0, right: 0, bottom: 0, left: 0,
    })
    .append(container)
    .appendTo('body')

    overlay.on('click', function(e) {
      if (e.target !== this) return;
      overlay.remove()
    })
  }

})

// Creates an avatar generator immediately after the <script>.
CycleLove.AvatarGenerator.create = function(options) {
  var id = 'cyclelove-avatar-generator'
  document.write('<div id="' + id + '"></div>')
  options = $.extend({}, options, { el: '#' + id })
  new CycleLove.AvatarGenerator(options)
}

// Creates an avatar generator on the selected elements.
$.fn.cycleLoveAvatarGenerator = function() {
  return this.each(function() {
    new CycleLove.AvatarGenerator({ el: this })
  })
}
