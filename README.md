# CycleLove Avatar Generator

To use, drop the following lines in at the desired point on the page:

```html
<script src="path/to/cyclelove-avatar-generator.js"></script>
<script>
  CycleLove.AvatarGenerator.create({
    size: 400,
    colours: ['red', 'blue', 'gold', 'pink', 'black'], // colour palette
    bikes: ['road-bike.svg', 'brompton.svg', 'bmx.svg'] // bike urls
  })
</script>
```

Right now, there are a bunch of dependencies (jQuery, canvg, rgbcolor) that
need to be included manually. To put a pretty bow on this, we’ll make sure
the script takes care of loading its own dependencies.

This will be compatible with Chrome, Safari, Firefox, Opera, and IE 9+.

## Copyright

Copyright &copy; 2012 With Associates Ltd.
