---
sidebar_position: 5
---

# Fallback Styles

There are situations in StyleX where, when you need fallback styles for browsers that don't support a certain new style property.

In CSS you may do something like this:

```css
.header {
  position: fixed;
  position: -webkit-sticky;
  position: sticky;
}
```

This kind of syntax is not possible when using Javascript objects. So in StyleX you can use the `firstThatWorks` function to achieve the same thing.

```tsx
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  header: {
    position: stylex.firstThatWorks('sticky', '-webkit-sticky', 'fixed'),
  },
});
```

Usage remains the same as always.

```tsx
<header className={stylex(styles.header)} />
```