# Button Migration Guide

**Component:** button
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/button.mdx

---

<page url="/docs/react/migration/button">
# Button

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/button
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/button.mdx
> Migration guide for Button from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Button documentation](/docs/react/components/button) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Structure Changes

In v2, `Button` used a combination of `color` and `variant` props:

```tsx
import { Button } from "@heroui/react";

export default function App() {
  return <Button color="primary" variant="solid">Button</Button>;
}

```

In v3, Button uses only the `variant` prop (no separate `color` prop):

```tsx
import { Button } from "@heroui/react";

export default function App() {
  return <Button variant="primary">Button</Button>;
}

```

## Key Changes

### 1. Variants and Colors

**v2:** Used `color` + `variant` combination\
**v3:** Uses `variant` only (no separate `color` prop)

| v2 Color + Variant                   | v3 Variant              | Notes                                     |
| ------------------------------------ | ----------------------- | ----------------------------------------- |
| `color="primary" variant="solid"`    | `variant="primary"`     | Default primary button                    |
| `color="default" variant="solid"`    | `variant="primary"`     | Use primary variant                       |
| `color="secondary" variant="solid"`  | `variant="secondary"`   | Same                                      |
| `color="success" variant="solid"`    | `variant="primary"`     | Use primary with custom styling if needed |
| `color="warning" variant="solid"`    | `variant="primary"`     | Use primary with custom styling if needed |
| `color="danger" variant="solid"`     | `variant="danger"`      | Danger variant available                  |
| `color="primary" variant="bordered"` | `variant="secondary"`   | Similar appearance                        |
| `color="primary" variant="light"`    | `variant="tertiary"`    | Similar appearance                        |
| `color="primary" variant="flat"`     | `variant="tertiary"`    | Similar appearance                        |
| `color="primary" variant="faded"`    | `variant="secondary"`   | Similar appearance                        |
| `color="primary" variant="ghost"`    | `variant="ghost"`       | Same                                      |
| `color="danger" variant="flat"`      | `variant="danger-soft"` | New soft danger variant                   |

**v2 Variants:** `solid`, `bordered`, `light`, `flat`, `faded`, `shadow`, `ghost`\
**v3 Variants:** `primary`, `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`

### 2. Loading State: `isLoading` → `isPending`

**v2:** Used `isLoading` prop\
**v3:** Uses `isPending` prop

### 3. Default Width Behavior

**v2:** Buttons had minimum widths based on size (`min-w-16` for sm, `min-w-20` for md, `min-w-24` for lg)\
**v3:** Buttons use `w-fit` by default (width fits content, no minimum width)

This means v3 buttons will be narrower than v2 buttons when they have short text. To maintain v2's minimum width behavior, add Tailwind classes see the [Minimum Width](#minimum-width) example section.

### 4. Prop Changes

| v2 Prop                       | v3 Location | Notes                                                             |
| ----------------------------- | ----------- | ----------------------------------------------------------------- |
| `isLoading`                   | `Button`    | Renamed to `isPending`                                            |
| `isIconOnly`                  | `Button`    | Still available in v3 — renders a square button with only an icon |
| `color`                       | -           | Removed (variants handle styling)                                 |
| `radius`                      | -           | Removed (use Tailwind e.g. `rounded-lg`)                          |
| `startContent`, `endContent`  | -           | Place icons as children                                           |
| `spinner`, `spinnerPlacement` | -           | Handle loading manually with render props                         |
| `disableRipple`               | -           | Removed (ripple removed in v3)                                    |
| `disableAnimation`            | -           | Removed (animations handled internally)                           |
| `classNames`                  | -           | Use `className`                                                   |

### 5. ButtonGroup Available

**v2:** Had a dedicated `ButtonGroup` component\
**v3:** `ButtonGroup` continues to exist. See the [ButtonGroup migration guide](/docs/react/migration/button-group) for details.

## Migration Examples

### Variants

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Button color="primary" variant="solid">Solid</Button>
    <Button color="primary" variant="bordered">Bordered</Button>
    <Button color="primary" variant="ghost">Ghost</Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    ```
  </Tab>
</Tabs>

### Danger Soft Variant

The `danger-soft` variant is new in v3. It replaces the v2 pattern of using a flat danger button.

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Button color="danger" variant="flat">Delete</Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Button variant="danger-soft">Delete</Button>
    ```
  </Tab>
</Tabs>

### Icon Only (`isIconOnly`)

The `isIconOnly` prop is available in both v2 and v3. It renders a square button sized to fit a single icon. In v3, use `variant` instead of `color` for styling.

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Button isIconOnly color="danger" variant="flat">
      <HeartIcon />
    </Button>
    <Button isIconOnly color="primary" variant="bordered" size="sm">
      <SearchIcon />
    </Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Icon } from "@iconify/react";

    <Button isIconOnly variant="danger-soft">
      <Icon icon="gravity-ui:heart" />
    </Button>
    <Button isIconOnly variant="secondary" size="sm">
      <Icon icon="gravity-ui:magnifier" />
    </Button>
    ```
  </Tab>
</Tabs>

### Loading State

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Simple loading */}
    <Button isLoading color="primary">
      Loading
    </Button>

    {/* Loading with conditional content */}
    <Button 
      isLoading={isLoading}
      spinnerPlacement="start"
      color="primary"
      onPress={() => setIsLoading(true)}
    >
      Upload File
    </Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";
    import { Spinner } from "@heroui/react";
    import { Icon } from "@iconify/react";

    const [isLoading, setIsLoading] = useState(false);

    {/* Simple loading */}
    <Button isPending={isLoading}>
      {({isPending}) => (
        <>
          {isPending && <Spinner color="current" size="sm" />}
          Loading
        </>
      )}
    </Button>

    {/* Loading with conditional content */}
    <Button 
      isPending={isLoading}
      onPress={() => setIsLoading(true)}
    >
      {({isPending}) => (
        <>
          {isPending ? (
            <Spinner color="current" size="sm" />
          ) : (
            <Icon icon="gravity-ui:paperclip" />
          )}
          {isPending ? "Uploading..." : "Upload File"}
        </>
      )}
    </Button>
    ```
  </Tab>
</Tabs>

### With Icons

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Icon } from "@iconify/react";

    <Button 
      color="success" 
      endContent={<Icon icon="gravity-ui:camera" />}
    >
      Take a photo
    </Button>
    <Button 
      color="danger" 
      startContent={<Icon icon="gravity-ui:trash-bin" />}
      variant="bordered"
    >
      Delete user
    </Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Icon } from "@iconify/react";

    <Button variant="primary">
      <Icon icon="gravity-ui:camera" />
      Take a photo
    </Button>
    <Button variant="secondary">
      <Icon icon="gravity-ui:trash-bin" />
      Delete user
    </Button>
    ```
  </Tab>
</Tabs>

### Icon Only Button

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Button isIconOnly color="danger">
      <HeartIcon />
    </Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Icon } from "@iconify/react";

    <Button isIconOnly variant="danger">
      <Icon icon="gravity-ui:heart" />
    </Button>
    ```
  </Tab>
</Tabs>

### Button Group

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Button, ButtonGroup } from "@heroui/react";

    <ButtonGroup size="sm" color="primary" variant="solid">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Button, ButtonGroup } from "@heroui/react";

    <ButtonGroup size="sm" variant="primary">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    ```
  </Tab>
</Tabs>

### Sizes and Minimum Width

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* v2 automatically applies minimum widths */}
    <Button size="md" color="primary">Save</Button>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* v3 uses w-fit by default - add min-width to match v2 */}
    <Button size="md" variant="primary" className="min-w-20">
      Save
    </Button>
    ```
  </Tab>
</Tabs>

## Render Props Pattern

v3 Button supports a render prop pattern that provides state information:

```tsx
<Button isPending={isLoading}>
  {({isPending, isPressed, isHovered, isFocused, isFocusVisible, isDisabled}) => (
    <>
      {isPending && <Spinner size="sm" />}
      {isPressed ? "Pressed!" : "Click me"}
    </>
  )}
</Button>

```

Available render props:

* `isPending` - Whether button is in loading state
* `isPressed` - Whether button is currently pressed
* `isHovered` - Whether button is hovered
* `isFocused` - Whether button is focused
* `isFocusVisible` - Whether button should show focus indicator
* `isDisabled` - Whether button is disabled

## Summary

1. **Color Prop Removed**: Use `variant` prop instead of `color` + `variant`
2. **Variants Changed**: New variant system (`primary`, `secondary`, `tertiary`, `outline`, `ghost`, `danger`, `danger-soft`)
3. **`danger-soft` Variant**: New in v3, replaces v2's `color="danger" variant="flat"` pattern
4. **isLoading → isPending**: Loading prop renamed
5. **isIconOnly**: Still supported in v3 — renders a square button for icon-only use
6. **Default Width Changed**: Buttons now use `w-fit` instead of minimum widths - add `min-w-*` classes to match v2 behavior
7. **Icons**: `startContent`/`endContent` removed - place icons as children
8. **Loading Spinner**: Must handle spinner manually with render props
9. **Render Props**: v3 Button children can be a function receiving `isPending`, `isPressed`, `isHovered`, `isFocused`, `isFocusVisible`, and `isDisabled`
10. **Radius Removed**: Use Tailwind CSS classes
11. **Ripple Removed**: No ripple effect in v3
12. **ButtonGroup Available**: See [ButtonGroup migration guide](/docs/react/migration/button-group)
13. **ClassNames Removed**: Use `className` prop

</page>

---

# Link Migration Guide

**Component:** link
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/link.mdx

---

<page url="/docs/react/migration/link">
# Link

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/link
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/link.mdx
> Migration guide for Link from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Link documentation](/docs/react/components/link) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Key Changes

### 1. Component Structure

**v2:** Single component with icon props\
**v3:** Compound component: `Link.Icon` for icons

### 2. Prop Changes

| v2 Prop                        | v3 Location | Notes                                                 |
| ------------------------------ | ----------- | ----------------------------------------------------- |
| `showAnchorIcon`, `anchorIcon` | -           | Use `Link.Icon` component with children               |
| `isExternal`                   | -           | Use `target="_blank"` and `rel="noopener noreferrer"` |
| `size`, `color`, `isBlock`     | -           | Removed (use Tailwind CSS)                            |
| `disableAnimation`             | -           | Removed                                               |
| `underline`                    | -           | Removed (use Tailwind `underline`, etc.)              |

### 3. New Props

* `onPress` - Event handler fired when the link is activated (via click or keyboard). Accepts a `(e: PressEvent) => void` callback.

## Structure Changes

In v2, Link component usage:

```tsx
import { Link } from "@heroui/react";

export default function App() {
  return <Link href="#">Default Link</Link>;
}

```

In v3, Link component usage remains the same for basic cases:

```tsx
import { Link } from "@heroui/react";

export default function App() {
  return <Link href="#">Default Link</Link>;
}

```

## Migration Examples

### With Icons

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Default icon */}
    <Link showAnchorIcon href="#">
      External Link
    </Link>

    {/* Custom icon */}
    <Link
      showAnchorIcon
      anchorIcon={<CustomIcon />}
      href="#"
    >
      Custom Icon
    </Link>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Default icon */}
    <Link href="#">
      External Link
      <Link.Icon />
    </Link>

    {/* Custom icon */}
    <Link href="#">
      Custom Icon
      <Link.Icon>
        <CustomIcon />
      </Link.Icon>
    </Link>
    ```
  </Tab>
</Tabs>

### External Link

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Link isExternal href="https://example.com">
      External Link
    </Link>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Link
      href="https://example.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      External Link
      <Link.Icon />
    </Link>
    ```
  </Tab>
</Tabs>

### Underline and offset (v3: use Tailwind)

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Link href="#" underline="hover">
      Hover to underline
    </Link>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Link href="#" className="hover:underline">
      Hover to underline
    </Link>
    <Link href="#" className="underline underline-offset-2">
      Underline with offset
    </Link>
    ```
  </Tab>
</Tabs>

### With routing libraries

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import NextLink from "next/link";
    import { Link } from "@heroui/react";

    <Link as={NextLink} href="/about">
      About
    </Link>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import NextLink from "next/link";
    import { Link } from "@heroui/react";

    {/* Style your router link with the same classes as Link; add an icon if needed */}
    <NextLink href="/about" className="link hover:underline">
      About
    </NextLink>
    ```
  </Tab>
</Tabs>

## Component Anatomy

The v3 Link follows this structure:

```
Link (Root)
  ├── Link content (text)
  └── Link.Icon (optional)

```

## Summary

1. **Icon Handling**: `showAnchorIcon` and `anchorIcon` props replaced with `Link.Icon` component
2. **External Links**: `isExternal` prop removed - handle manually with `target` and `rel`
3. **Size Prop Removed**: Use Tailwind CSS classes (`text-sm`, `text-base`, `text-lg`)
4. **Color Prop Removed**: Use Tailwind CSS classes (`text-primary`, `text-danger`, etc.)
5. **Block Prop Removed**: Use Tailwind CSS classes (`block`, `hover:bg-surface`)
6. **Underline**: No longer a prop; use Tailwind (`underline`, `hover:underline`, `no-underline`, `underline-offset-1`, etc.)
7. **Routing**: v3 Link does not support `as` or `asChild`; use your router's Link with Tailwind classes (e.g. `link`, `link__icon`) for consistent styling
8. **Animation Removed**: `disableAnimation` prop removed
9. **`onPress` Handler**: New `onPress` prop available for handling link activation events (click or keyboard)

</page>

---

# Image Migration Guide

**Component:** image
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/image.mdx

---

<page url="/docs/react/migration/image">
# Image

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/image
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/image.mdx
> Migration guide for Image from HeroUI v2 to v3


<Callout type="warning">
  The Image component has been **removed** in HeroUI v3. Use native HTML `<img>` element or Next.js `Image` component with Tailwind CSS classes instead.
</Callout>

## Key Changes

### 1. Component Removal

**v2:** `<Image>` component from `@heroui/react`\
**v3:** Native HTML `<img>` element or Next.js `Image` component

### 2. Features Mapping

The v2 Image component had several features that need to be replaced:

| v2 Feature                           | v3 Equivalent                | Notes                                                        |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| `radius` prop                        | `rounded-*` Tailwind classes | Use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full` |
| `shadow` prop                        | `shadow-*` Tailwind classes  | Use `shadow-sm`, `shadow-md`, `shadow-lg`                    |
| `isBlurred` prop                     | Manual blur implementation   | Use CSS `filter: blur()` or Tailwind `blur-*` utilities      |
| `isZoomed` prop                      | Manual hover zoom            | Use `hover:scale-*` Tailwind classes                         |
| `fallbackSrc` prop                   | Manual error handling        | Use `onError` handler with state                             |
| `disableSkeleton` / Loading skeleton | Manual loading state         | Use React state + conditional rendering                      |
| `removeWrapper` prop                 | Direct rendering             | No wrapper needed, render `<img>` directly                   |

## Structure Changes

In v2, `Image` was a component wrapper around the native `<img>` element:

```tsx
import { Image } from "@heroui/react";

export default function App() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Example image"
      width={300}
      height={200}
    />
  );
}

```

In v3, use the native `<img>` element directly with Tailwind CSS classes:

```tsx
export default function App() {
  return (
    <img
      src="https://example.com/image.jpg"
      alt="Example image"
      width={300}
      height={200}
      className="rounded-lg"
    />
  );
}

```

## Migration Examples

### With Next.js Image (Recommended)

If you're using Next.js, use the optimized `Image` component:

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Image } from "@heroui/react";

    <Image
      src="/image.jpg"
      alt="Example"
      width={300}
      height={200}
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import Image from "next/image";

    <Image
      src="/image.jpg"
      alt="Example"
      width={300}
      height={200}
      className="rounded-lg"
    />
    ```
  </Tab>
</Tabs>

### With Zoom Effect

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Image isZoomed src="..." alt="..." />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <div className="relative overflow-hidden rounded-lg">
      <img
        src="..."
        alt="..."
        className="object-cover transition-transform duration-300 hover:scale-125"
      />
    </div>
    ```
  </Tab>
</Tabs>

### With Blur Effect

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Image isBlurred src="..." alt="..." />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <div className="relative">
      <img
        src="..."
        alt="..."
        className="relative z-10"
      />
      <img
        src="..."
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full scale-105 object-cover blur-lg opacity-30 saturate-150"
      />
    </div>
    ```
  </Tab>
</Tabs>

### With Fallback Image

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Image
      src="https://example.com/image.jpg"
      fallbackSrc="/fallback.jpg"
      alt="Example"
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";

    function ImageWithFallback({ src, fallbackSrc, alt, ...props }) {
      const [imgSrc, setImgSrc] = useState(src);

      return (
        <img
          src={imgSrc}
          alt={alt}
          onError={() => setImgSrc(fallbackSrc)}
          {...props}
        />
      );
    }

    <ImageWithFallback
      src="https://example.com/image.jpg"
      fallbackSrc="/fallback.jpg"
      alt="Example"
    />
    ```
  </Tab>
</Tabs>

### With Loading Skeleton

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Image
      src="https://example.com/image.jpg"
      alt="Example"
      disableSkeleton={false}
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";

    function ImageWithSkeleton({ src, alt, ...props }) {
      const [isLoading, setIsLoading] = useState(true);
      const [hasError, setHasError] = useState(false);

      return (
        <div className="relative overflow-hidden rounded-lg bg-default-200">
          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-default-300 to-transparent" />
          )}
          <img
            src={src}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            {...props}
          />
        </div>
      );
    }

    <ImageWithSkeleton src="https://example.com/image.jpg" alt="Example" />
    ```
  </Tab>
</Tabs>

### Combined Features

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Image
      src="https://example.com/image.jpg"
      alt="Example"
      radius="lg"
      shadow="md"
      isZoomed
      isBlurred
      width={400}
      height={300}
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <div className="relative overflow-hidden rounded-lg shadow-md">
      <img
        src="https://example.com/image.jpg"
        alt="Example"
        width={400}
        height={300}
        className="relative z-10 object-cover transition-transform duration-300 hover:scale-125"
      />
      <img
        src="https://example.com/image.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full scale-105 object-cover blur-lg opacity-30 saturate-150"
      />
    </div>
    ```
  </Tab>
</Tabs>

## Creating a Reusable Image Component (Optional)

If you frequently use images with similar features, you can create a reusable component:

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Image } from "@heroui/react";

    <Image
      src="..."
      radius="lg"
      shadow="md"
      isZoomed
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";
    import { cn } from "@/lib/utils"; // or your cn utility

    interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
      radius?: "none" | "sm" | "md" | "lg" | "full";
      shadow?: "none" | "sm" | "md" | "lg";
      isZoomed?: boolean;
      isBlurred?: boolean;
      fallbackSrc?: string;
    }

    const radiusClasses = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    const shadowClasses = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    };

    export function CustomImage({
      src,
      alt,
      className,
      radius = "lg",
      shadow = "none",
      isZoomed = false,
      isBlurred = false,
      fallbackSrc,
      onError,
      ...props
    }: CustomImageProps) {
      const [imgSrc, setImgSrc] = useState(src);
      const [isLoading, setIsLoading] = useState(true);

      const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        onError?.(e);
      };

      const imageElement = (
        <img
          src={imgSrc}
          alt={alt}
          className={cn(
            radiusClasses[radius],
            shadowClasses[shadow],
            isZoomed && "object-cover transition-transform duration-300 hover:scale-125",
            isLoading && "opacity-0",
            "transition-opacity duration-300",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          {...props}
        />
      );

      if (isBlurred) {
        return (
          <div className={cn("relative", radiusClasses[radius], shadowClasses[shadow])}>
            {imageElement}
            <img
              src={imgSrc}
              alt=""
              aria-hidden="true"
              className={cn(
                "absolute inset-0 z-0 h-full w-full scale-105 object-cover blur-lg opacity-30 saturate-150",
                radiusClasses[radius]
              )}
            />
          </div>
        );
      }

      if (isZoomed || isLoading) {
        return (
          <div className={cn("relative overflow-hidden", radiusClasses[radius], shadowClasses[shadow])}>
            {isLoading && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-default-300 to-transparent" />
            )}
            {imageElement}
          </div>
        );
      }

      return imageElement;
    }

    // Usage
    <CustomImage
      src="..."
      alt="Example"
      radius="lg"
      shadow="md"
      isZoomed
      isBlurred
      fallbackSrc="/fallback.jpg"
    />
    ```
  </Tab>
</Tabs>

## Complete Example

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Image } from "@heroui/react";

    export default function App() {
      return (
        <div className="space-y-4">
          <Image
            src="https://example.com/image1.jpg"
            alt="Image 1"
            width={300}
            height={200}
            radius="lg"
            shadow="md"
          />
          <Image
            src="https://example.com/image2.jpg"
            alt="Image 2"
            width={300}
            height={200}
            isZoomed
            radius="lg"
          />
          <Image
            src="https://example.com/image3.jpg"
            alt="Image 3"
            width={300}
            height={200}
            isBlurred
            radius="full"
          />
        </div>
      );
    }
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    export default function App() {
      return (
        <div className="space-y-4">
          <img
            src="https://example.com/image1.jpg"
            alt="Image 1"
            width={300}
            height={200}
            className="rounded-lg shadow-md"
          />
          <div className="relative overflow-hidden rounded-lg">
            <img
              src="https://example.com/image2.jpg"
              alt="Image 2"
              width={300}
              height={200}
              className="object-cover transition-transform duration-300 hover:scale-125"
            />
          </div>
          <div className="relative rounded-full">
            <img
              src="https://example.com/image3.jpg"
              alt="Image 3"
              width={300}
              height={300}
              className="relative z-10 rounded-full"
            />
            <img
              src="https://example.com/image3.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 z-0 h-full w-full scale-105 object-cover rounded-full blur-lg opacity-30 saturate-150"
            />
          </div>
        </div>
      );
    }
    ```
  </Tab>
</Tabs>

## Summary

1. **Component Removed**: `Image` component no longer exists in v3
2. **Import Change**: Remove `import { Image } from "@heroui/react"`
3. **Use Native Element**: Replace with native `<img>` HTML element or Next.js `Image`
4. **Features**: Implement blur, zoom, skeleton, and fallback manually
5. **Styling**: Apply Tailwind CSS classes directly for radius, shadow, and effects

## Migration Steps

1. **Remove Import**: Remove `Image` from `@heroui/react` imports
2. **Replace Component**: Replace all `<Image>` instances with `<img>` elements
3. **Add Tailwind Classes**: Apply equivalent Tailwind classes for styling (radius, shadow)
4. **Implement Features**: Add manual implementations for blur, zoom, skeleton, and fallback if needed
5. **Use Next.js Image**: If using Next.js, consider using `next/image` for optimization
6. **Optional**: Create reusable wrapper components for frequently used patterns

## Next.js Image Component

If you're using Next.js, the `Image` component from `next/image` provides:

* Automatic image optimization
* Lazy loading by default
* Responsive images with `srcSet`
* Placeholder blur support
* Built-in loading states

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Example"
  width={300}
  height={200}
  className="rounded-lg shadow-md"
  placeholder="blur" // Optional: blur placeholder
  blurDataURL="data:image/..." // Optional: base64 blur data
/>

```

</page>

---

# Card Migration Guide

**Component:** card
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/card.mdx

---

<page url="/docs/react/migration/card">
# Card

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/card
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/card.mdx
> Migration guide for Card from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Card documentation](/docs/react/components/card) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Structure Changes

In v2, Card used separate components: `CardHeader`, `CardBody`, and `CardFooter`:

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function App() {
  return (
    <Card>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
}

```

In v3, Card uses a compound component pattern with explicit subcomponents:

```tsx
import { Card } from "@heroui/react";

export default function App() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Title</Card.Title>
        <Card.Description>Description</Card.Description>
      </Card.Header>
      <Card.Content>Body content</Card.Content>
      <Card.Footer>Footer</Card.Footer>
    </Card>
  );
}

```

## Key Changes

### 1. Component Structure

**v2:** Separate components: `CardHeader`, `CardBody`, `CardFooter`\
**v3:** Compound components: `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`

### 2. Component Name Changes

| v2 Component | v3 Component       | Notes                                    |
| ------------ | ------------------ | ---------------------------------------- |
| `CardHeader` | `Card.Header`      | Same functionality                       |
| `CardBody`   | `Card.Content`     | Renamed                                  |
| `CardFooter` | `Card.Footer`      | Same functionality                       |
| -            | `Card.Title`       | New subcomponent for header titles       |
| -            | `Card.Description` | New subcomponent for header descriptions |

### 3. Prop Changes

| v2 Prop                             | v3 Location | Notes                                                |
| ----------------------------------- | ----------- | ---------------------------------------------------- |
| `shadow`                            | -           | Removed (use Tailwind e.g. `shadow-sm`, `shadow-md`) |
| `radius`                            | -           | Removed (use Tailwind e.g. `rounded-lg`)             |
| `fullWidth`                         | -           | Removed (use Tailwind `w-full`)                      |
| `isHoverable`                       | -           | Removed (use Tailwind hover classes)                 |
| `isPressable`                       | -           | Use button or link wrapper inside Card               |
| `isBlurred`, `isFooterBlurred`      | -           | Removed (use Tailwind `backdrop-blur-*`)             |
| `isDisabled`                        | -           | Removed (handle with conditional rendering)          |
| `disableAnimation`, `disableRipple` | -           | Removed                                              |
| `allowTextSelectionOnPress`         | -           | Removed (not applicable)                             |
| `classNames`                        | -           | Use `className` on parts                             |

### 4. Variants

**v2:** No variant prop (used shadow/radius for styling)\
**v3:** Has `variant` prop: `transparent`, `default`, `secondary`, `tertiary`

## Migration Examples

### Card Structure

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Basic structure */}
    <Card>
      <CardHeader>Header</CardHeader>
      <CardBody>Body content</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>

    {/* With title and description */}
    <Card>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Daily Mix</p>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="font-bold text-large">Frontend Radio</h4>
      </CardHeader>
      <CardBody>Content</CardBody>
    </Card>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Basic structure */}
    <Card>
      <Card.Header>
        <Card.Title>Header</Card.Title>
      </Card.Header>
      <Card.Content>Body content</Card.Content>
      <Card.Footer>Footer</Card.Footer>
    </Card>

    {/* With title and description */}
    <Card>
      <Card.Header>
        <Card.Title>Frontend Radio</Card.Title>
        <Card.Description>Daily Mix • 12 Tracks</Card.Description>
      </Card.Header>
      <Card.Content>Content</Card.Content>
    </Card>
    ```
  </Tab>
</Tabs>

### Pressable Card

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Card 
      isPressable 
      shadow="sm" 
      onPress={() => console.log("pressed")}
    >
      <CardBody>Clickable card</CardBody>
    </Card>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Card className="shadow-sm">
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={() => console.log("pressed")}
      >
        <Card.Content>Clickable card</Card.Content>
      </button>
    </Card>
    ```
  </Tab>
</Tabs>

### Card with Image

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">Frontend Radio</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="https://example.com/image.jpg"
          width={270}
        />
      </CardBody>
    </Card>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Card className="py-4">
      <Card.Header>
        <Card.Title>Frontend Radio</Card.Title>
      </Card.Header>
      <Card.Content className="overflow-visible py-2">
        <img
          alt="Card background"
          className="object-cover rounded-xl w-full"
          src="https://example.com/image.jpg"
        />
      </Card.Content>
    </Card>
    ```
  </Tab>
</Tabs>

### Blurred Footer Card

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Card, CardFooter, Image, Button } from "@heroui/react";

    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt="Woman listing to music"
        className="object-cover"
        height={200}
        src="https://example.com/image.jpg"
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button className="text-tiny text-white bg-black/20" size="sm">
          Notify me
        </Button>
      </CardFooter>
    </Card>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Card, Button } from "@heroui/react";

    <Card className="border-none rounded-lg relative overflow-hidden">
      <img
        alt="Woman listing to music"
        className="object-cover w-full h-[200px]"
        src="https://example.com/image.jpg"
      />
      <Card.Footer className="justify-between backdrop-blur-md bg-white/10 border-white/20 border overflow-hidden py-1 absolute rounded-lg bottom-1 w-[calc(100%_-_8px)] shadow-sm ml-1 z-10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button className="text-tiny text-white bg-black/20" size="sm">
          Notify me
        </Button>
      </Card.Footer>
    </Card>
    ```
  </Tab>
</Tabs>

### Card Variants

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* v2 doesn't have variants, uses shadow/radius */}
    <Card shadow="md" radius="lg">
      <CardBody>Content</CardBody>
    </Card>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Card variant="default">
      <Card.Content>Content</Card.Content>
    </Card>
    <Card variant="secondary">
      <Card.Content>Content</Card.Content>
    </Card>
    ```
  </Tab>
</Tabs>

## Styling Changes

### v2: `classNames` Prop

```tsx
<Card 
  classNames={{
    base: "custom-base",
    header: "custom-header",
    body: "custom-body",
    footer: "custom-footer"
  }}
/>

```

### v3: Direct `className` Props

```tsx
<Card className="custom-base">
  <Card.Header className="custom-header">
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content className="custom-body">
    Content
  </Card.Content>
  <Card.Footer className="custom-footer">
    Footer
  </Card.Footer>
</Card>

```

## Component Anatomy

The v3 Card follows this structure:

```

Card (Root)
  ├── Card.Header (optional)
  │   ├── Card.Title (optional)
  │   └── Card.Description (optional)
  ├── Card.Content (optional)
  └── Card.Footer (optional)

```

## Summary

1. **Component Structure**: Must use compound components instead of separate components
2. **CardBody → Card.Content**: Component renamed
3. **New Subcomponents**: `Card.Title` and `Card.Description` for structured headers
4. **Props Removed**: Many styling props removed; use Tailwind CSS classes
5. **Pressable Cards**: Use a button or link inside Card instead of `isPressable`
6. **Blur Effects**: Use Tailwind `backdrop-blur-*` classes instead of props
7. **Variants**: New variant system for semantic prominence levels
8. **ClassNames Removed**: Use `className` props on individual components

</page>

---

# Spinner Migration Guide

**Component:** spinner
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/spinner.mdx

---

<page url="/docs/react/migration/spinner">
# Spinner

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/spinner
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/spinner.mdx
> Migration guide for Spinner from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Spinner documentation](/docs/react/components/spinner) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Structure Changes

In v2, Spinner supported multiple variants and labels:

```tsx
import { Spinner } from "@heroui/react";

export default function App() {
  return <Spinner variant="default" label="Loading..." color="primary" />;
}

```

In v3, Spinner is simplified to a single circular variant:

```tsx
import { Spinner } from "@heroui/react";

export default function App() {
  return <Spinner color="accent" />;
}

```

## Key Changes

### 1. Component Behavior

**v2:** Supported multiple variants (`default`, `simple`, `gradient`, `wave`, `dots`, `spinner`) and labels\
**v3:** Single circular spinner variant, no label support

### 2. Prop Changes

| v2 Prop      | v3 Location | Notes                                                            |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `label`      | —           | Add label manually with separate element if needed               |
| `variant`    | —           | Only one spinner variant available                               |
| `labelColor` | —           | No label support                                                 |
| `classNames` | —           | Use `className` prop directly                                    |
| `size`       | `size`      | Changed: `"sm" \| "md" \| "lg"` → `"sm" \| "md" \| "lg" \| "xl"` |
| `color`      | `color`     | Changed values (see below)                                       |

### 3. Changed Color Values

* `"default"` → `"current"` (inherits current text color)
* `"primary"` → `"accent"`
* `"secondary"` → Removed (use `"current"` or `"accent"`)
* `"success"`, `"warning"`, `"danger"` → Still available

## Migration Examples

### With Label

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Simple label */}
    <Spinner label="Loading..." />

    {/* With label color and custom styling */}
    <Spinner
      label="Loading..."
      labelColor="primary"
      classNames={{
        label: "text-foreground mt-4"
      }}
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Simple label */}
    <div className="flex flex-col items-center gap-2">
      <Spinner />
      <span>Loading...</span>
    </div>

    {/* With custom styling */}
    <div className="flex flex-col items-center gap-2">
      <Spinner />
      <span className="text-foreground mt-4">Loading...</span>
    </div>
    ```
  </Tab>
</Tabs>

### Sizes and Colors

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Sizes */}
    <div className="flex gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>

    {/* Colors */}
    <div className="flex gap-4">
      <Spinner color="default" />
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
    </div>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Sizes */}
    <div className="flex gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>

    {/* Colors */}
    <div className="flex gap-4">
      <Spinner color="current" />
      <Spinner color="accent" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
    </div>
    ```
  </Tab>
</Tabs>

### Variants (Removed)

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <div className="flex gap-4">
      <Spinner variant="default" />
      <Spinner variant="simple" />
      <Spinner variant="gradient" />
      <Spinner variant="wave" />
      <Spinner variant="dots" />
      <Spinner variant="spinner" />
    </div>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Only one variant available - circular spinner */}
    <Spinner />

    {/* For other spinner styles, consider using CSS animations */}
    ```
  </Tab>
</Tabs>

## Color Mapping

When migrating colors, use this mapping:

| v2 Color      | v3 Color                  | Notes                       |
| ------------- | ------------------------- | --------------------------- |
| `"default"`   | `"current"`               | Inherits current text color |
| `"primary"`   | `"accent"`                | Use accent color            |
| `"secondary"` | `"current"` or `"accent"` | Use current or accent       |
| `"success"`   | `"success"`               | No change                   |
| `"warning"`   | `"warning"`               | No change                   |
| `"danger"`    | `"danger"`                | No change                   |

## Summary

1. **No Label Support**: `label` prop removed - add label manually if needed
2. **No Variants**: `variant` prop removed - only one circular spinner available
3. **No Label Color**: `labelColor` prop removed - style label manually
4. **Color Values Changed**: `"default"` → `"current"`, `"primary"` → `"accent"`, `"secondary"` removed
5. **Size Added**: New `"xl"` size option available
6. **ClassNames Removed**: Use `className` prop directly

</page>

---

# Switch Migration Guide

**Component:** switch
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/switch.mdx

---

<page url="/docs/react/migration/switch">
# Switch

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/switch
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/switch.mdx
> Migration guide for Switch from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Switch documentation](/docs/react/components/switch) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Structure Changes

In v2, Switch used a simple structure with children as label:

```tsx
import { Switch } from "@heroui/react";

export default function App() {
  return <Switch>Enable notifications</Switch>;
}

```

In v3, Switch requires compound components:

```tsx
import { Switch, Label } from "@heroui/react";

export default function App() {
  return (
    <Switch>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Enable notifications</Label>
      </Switch.Content>
    </Switch>
  );
}

```

## Key Changes

### 1. Component Structure

**v2:** Simple Switch with children as label
**v3:** Compound components (`Switch.Control`, `Switch.Thumb`, `Switch.Content`) with `Label` component

### 2. Prop Changes

| v2 Prop            | v3 Location | Notes                                          |
| ------------------ | ----------- | ---------------------------------------------- |
| `onValueChange`    | `onChange`  | Renamed event handler                          |
| `size`             | `size`      | Still exists on root (`sm` \| `md` \| `lg`)    |
| `label`            | —           | Use `Label` component                          |
| `color`            | —           | Removed (use Tailwind CSS)                     |
| `thumbIcon`        | —           | Use `Switch.Icon` inside `Switch.Thumb`        |
| `startContent`     | —           | Customize control directly                     |
| `endContent`       | —           | Customize control directly                     |
| `classNames`       | —           | Use `className` props on individual components |
| `disableAnimation` | —           | Removed (animations handled differently)       |

### 3. New Components

* `SwitchGroup` - For grouping multiple switches
* `Switch.Content` - Container for label and description
* `Switch.Icon` - For icons inside the thumb

## Migration Examples

### Controlled Switch

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { useState } from "react";

    const [isSelected, setIsSelected] = useState(true);

    <Switch isSelected={isSelected} onValueChange={setIsSelected}>
      Airplane mode
    </Switch>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";

    const [isSelected, setIsSelected] = useState(true);

    <Switch isSelected={isSelected} onChange={setIsSelected}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Airplane mode</Label>
      </Switch.Content>
    </Switch>
    ```
  </Tab>
</Tabs>

### Without Label

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Switch defaultSelected aria-label="Automatic updates" />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Switch defaultSelected aria-label="Automatic updates">
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
    ```
  </Tab>
</Tabs>

### With Thumb Icon

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Switch thumbIcon={<CheckIcon />}>Enable notifications</Switch>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Switch>
      <Switch.Control>
        <Switch.Thumb>
          <Switch.Icon>
            <CheckIcon />
          </Switch.Icon>
        </Switch.Thumb>
      </Switch.Control>
      <Switch.Content>
        <Label>Enable notifications</Label>
      </Switch.Content>
    </Switch>
    ```
  </Tab>
</Tabs>

### With Start/End Content

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Switch
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    >
      Dark mode
    </Switch>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Switch>
      <Switch.Control className="flex items-center gap-2">
        <SunIcon />
        <Switch.Thumb />
        <MoonIcon />
      </Switch.Control>
      <Switch.Content>
        <Label>Dark mode</Label>
      </Switch.Content>
    </Switch>
    ```
  </Tab>
</Tabs>

### With Label and Description

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Switch description="You will receive notifications for all activity">
      Enable notifications
    </Switch>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Switch, Label, Description } from "@heroui/react";

    <Switch>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Enable notifications</Label>
        <Description>You will receive notifications for all activity</Description>
      </Switch.Content>
    </Switch>
    ```
  </Tab>
</Tabs>

### Sizes and Colors

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Sizes */}
    <div className="flex gap-4">
      <Switch size="sm">Small</Switch>
      <Switch size="md">Medium</Switch>
      <Switch size="lg">Large</Switch>
    </div>

    {/* Colors */}
    <Switch color="primary">Primary</Switch>
    <Switch color="success">Success</Switch>
    <Switch color="danger">Danger</Switch>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Sizes */}
    <div className="flex gap-4">
      <Switch size="sm">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label>Small</Label>
        </Switch.Content>
      </Switch>
      <Switch size="md">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label>Medium</Label>
        </Switch.Content>
      </Switch>
      <Switch size="lg">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label>Large</Label>
        </Switch.Content>
      </Switch>
    </div>

    {/* Colors - Use Tailwind CSS classes */}
    <Switch>
      <Switch.Control className="data-[selected=true]:bg-accent">
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Primary</Label>
      </Switch.Content>
    </Switch>
    <Switch>
      <Switch.Control className="data-[selected=true]:bg-success">
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Success</Label>
      </Switch.Content>
    </Switch>
    <Switch>
      <Switch.Control className="data-[selected=true]:bg-danger">
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label>Danger</Label>
      </Switch.Content>
    </Switch>
    ```
  </Tab>
</Tabs>

### Switch Group

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* No built-in group component in v2 */}
    <div className="flex flex-col gap-2">
      <Switch name="notifications">Allow Notifications</Switch>
      <Switch name="marketing">Marketing emails</Switch>
    </div>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { SwitchGroup } from "@heroui/react";

    <SwitchGroup>
      <Switch name="notifications">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label>Allow Notifications</Label>
        </Switch.Content>
      </Switch>
      <Switch name="marketing">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label>Marketing emails</Label>
        </Switch.Content>
      </Switch>
    </SwitchGroup>
    ```
  </Tab>
</Tabs>

## Component Anatomy

The v3 Switch follows this structure:

```
Switch (Root)
  ├── Switch.Control
  │   └── Switch.Thumb
  │       └── Switch.Icon (optional)
  └── Switch.Content (optional)
      ├── Label (optional)
      └── Description (optional)

```

For groups:

```

SwitchGroup
  ├── Switch
  │   ├── Switch.Control
  │   │   └── Switch.Thumb
  │   └── Switch.Content
  │       ├── Label
  │       └── Description (optional)
  └── Switch
      ├── Switch.Control
      │   └── Switch.Thumb
      └── Switch.Content
          ├── Label
          └── Description (optional)

```

## Important Notes

### Event Handler

* **v2:** `onValueChange` prop
* **v3:** `onChange` prop (same signature: `(isSelected: boolean) => void`)

### Label Handling

* **v2:** Children were used as label
* **v3:** Use `Label` component inside `Switch.Content`; optionally add `Description` alongside it

### Icons

* **v2:** `thumbIcon` prop for icon inside thumb, `startContent`/`endContent` for icons outside
* **v3:** Use `Switch.Icon` inside `Switch.Thumb` for thumb icon, customize `Switch.Control` for start/end content

## Summary

1. **Component Structure**: Must use compound components (`Switch.Control`, `Switch.Thumb`, `Switch.Content`)
2. **Content Container**: Use `Switch.Content` to wrap `Label` and `Description` for proper layout
3. **Label Handling**: Children no longer used as label - use `Label` component inside `Switch.Content`
4. **Event Handler**: `onValueChange` → `onChange`
5. **Styling Props Removed**: `color` - use Tailwind CSS
6. **Icon Props Removed**: `thumbIcon`, `startContent`, `endContent` - use components or customize directly
7. **ClassNames Removed**: Use `className` props on individual components
8. **New Components**: `SwitchGroup` for grouping switches, `Switch.Content` for label/description container

</page>

---

# Chip Migration Guide

**Component:** chip
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/chip.mdx

---

<page url="/docs/react/migration/chip">
# Chip

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/chip
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/chip.mdx
> Migration guide for Chip from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Chip documentation](/docs/react/components/chip) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Key Changes

### 1. Variants

**v2:** `solid`, `bordered`, `light`, `flat`, `faded`, `shadow`, `dot`\
**v3:** `primary`, `secondary`, `tertiary`, `soft`

### 2. Colors

**v2:** `default`, `primary`, `secondary`, `success`, `warning`, `danger`\
**v3:** `default`, `accent`, `success`, `warning`, `danger`

### 3. Compound Component Pattern

v3 introduces a compound component pattern with the `Chip.Label` subcomponent:

* **`Chip.Label`** -- Renders the label text inside the chip. Plain-text children are automatically wrapped in `<Chip.Label>`, so explicit usage is optional but available for custom styling.

```tsx
{/* Implicit label -- plain text is auto-wrapped in Chip.Label */}
<Chip>Badge</Chip>

{/* Explicit label -- useful when you need a custom className */}
<Chip>
  <Chip.Label className="uppercase tracking-wide">Badge</Chip.Label>
</Chip>

```

### 4. Size Variants

**v2:** `sm`, `md`, `lg` (via the `size` prop)
**v3:** `sm`, `md`, `lg` (via the `size` prop -- same API)

The available sizes remain the same, but v3 applies them through BEM-style CSS classes (`chip--sm`, `chip--md`, `chip--lg`). The default size is `md`.

```tsx
<Chip size="sm">Small</Chip>
<Chip size="md">Medium (default)</Chip>
<Chip size="lg">Large</Chip>

```

### 5. Compound Variant Classes

v3 supports combining variant and color classes for precise styling. These compound classes have default styles defined in the CSS:

**Primary variant combinations:** `.chip--primary.chip--accent`, `.chip--primary.chip--success`, `.chip--primary.chip--warning`, `.chip--primary.chip--danger`

**Soft variant combinations:** `.chip--accent.chip--soft`, `.chip--success.chip--soft`, `.chip--warning.chip--soft`, `.chip--danger.chip--soft`

You can also target any other combination (e.g., `.chip--secondary.chip--accent`) via the `@layer components` directive in your CSS.

### 6. Prop Changes

| v2 Prop                      | v3 Location | Notes                                                     |
| ---------------------------- | ----------- | --------------------------------------------------------- |
| `radius`                     | -           | Removed (use Tailwind e.g. `rounded-full`)                |
| `avatar`                     | -           | Use children (e.g. `<Avatar />` as first child)           |
| `startContent`, `endContent` | -           | Use children directly                                     |
| `onClose`                    | -           | Implement close manually (e.g. `CloseButton`)             |
| `classNames`                 | -           | Use `className`                                           |
| `isDisabled`                 | -           | Use conditional rendering or Tailwind (e.g. `opacity-50`) |

### 7. Variant Mapping

| v2 Variant | v3 Equivalent | Notes                              |
| ---------- | ------------- | ---------------------------------- |
| `solid`    | `primary`     | Filled background                  |
| `bordered` | `secondary`   | Border with transparent background |
| `light`    | `soft`        | Light background                   |
| `flat`     | `tertiary`    | Transparent background             |
| `faded`    | `secondary`   | Similar appearance                 |
| `shadow`   | `primary`     | Use Tailwind `shadow-*` classes    |
| `dot`      | -             | Not available, implement manually  |

### 8. Color Mapping

| v2 Color    | v3 Equivalent         | Notes              |
| ----------- | --------------------- | ------------------ |
| `default`   | `default`             | Same               |
| `primary`   | `accent`              | Renamed            |
| `secondary` | `default` or `accent` | Depends on context |
| `success`   | `success`             | Same               |
| `warning`   | `warning`             | Same               |
| `danger`    | `danger`              | Same               |

## Structure Changes

In v2, `Chip` was a component that accepted various props for styling:

```tsx
import { Chip } from "@heroui/react";

export default function App() {
  return <Chip>Chip</Chip>;
}

```

In v3, `Chip` has a simplified API with fewer variants:

```tsx
import { Chip } from "@heroui/react";

export default function App() {
  return <Chip>Chip</Chip>;
}

```

## Migration Examples

### Variants and Colors

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Variants */}
    <Chip variant="solid">Solid</Chip>
    <Chip variant="bordered">Bordered</Chip>
    <Chip variant="light">Light</Chip>

    {/* Colors */}
    <Chip color="primary">Primary</Chip>
    <Chip color="success">Success</Chip>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    {/* Variants */}
    <Chip variant="primary">Primary</Chip>
    <Chip variant="secondary">Secondary</Chip>
    <Chip variant="soft">Soft</Chip>

    {/* Colors */}
    <Chip color="accent">Accent</Chip>
    <Chip color="success">Success</Chip>
    ```
  </Tab>
</Tabs>

### With Icons

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Icon } from "@iconify/react";

    {/* Start content */}
    <Chip startContent={<Icon icon="gravity-ui:check" />}>
      Chip
    </Chip>

    {/* End content */}
    <Chip endContent={<Icon icon="gravity-ui:chevron-down" />}>
      Chip
    </Chip>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Icon } from "@iconify/react";

    {/* Start content */}
    <Chip>
      <Icon icon="gravity-ui:check" />
      Chip
    </Chip>

    {/* End content */}
    <Chip>
      Chip
      <Icon icon="gravity-ui:chevron-down" />
    </Chip>
    ```
  </Tab>
</Tabs>

### With Avatar

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { Avatar } from "@heroui/react";

    <Chip
      avatar={<Avatar name="JW" src="https://example.com/avatar.jpg" />}
      variant="flat"
    >
      Avatar
    </Chip>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Avatar, Chip } from "@heroui/react";

    <Chip variant="tertiary">
      <Avatar size="sm">
        <Avatar.Image src="https://example.com/avatar.jpg" alt="JW" />
        <Avatar.Fallback>JW</Avatar.Fallback>
      </Avatar>
      Avatar
    </Chip>
    ```
  </Tab>
</Tabs>

### With Close Button

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Chip onClose={() => console.log("close")}>
      Chip
    </Chip>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { CloseButton } from "@heroui/react";

    <Chip>
      Chip
      <CloseButton 
        aria-label="Close chip"
        onPress={() => console.log("close")}
      />
    </Chip>
    ```
  </Tab>
</Tabs>

### Removed Variants

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* Dot variant */}
    <Chip variant="dot">Dot</Chip>

    {/* Shadow variant */}
    <Chip variant="shadow">Shadow</Chip>
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Icon } from "@iconify/react";

    {/* Dot variant - implement manually */}
    <Chip>
      <Icon icon="gravity-ui:circle-fill" width={6} />
      Dot
    </Chip>

    {/* Shadow variant - use Tailwind classes */}
    <Chip variant="primary" className="shadow-md">
      Shadow
    </Chip>
    ```
  </Tab>
</Tabs>

## Styling Changes

### v2: `classNames` Prop

```tsx
<Chip 
  classNames={{
    base: "custom-base",
    content: "custom-content",
    dot: "custom-dot",
    avatar: "custom-avatar",
    closeButton: "custom-close-button"
  }}
/>

```

### v3: Direct `className` Prop

```tsx
<Chip className="custom-base">
  {/* Content with custom classes */}
  <span className="custom-content">Chip</span>
</Chip>

```

## Summary

1. **Variants Reduced**: From 7 variants to 4 variants
2. **Color Changes**: `primary` → `accent`, `secondary` removed
3. **Compound Component**: `Chip.Label` subcomponent added; plain-text children are auto-wrapped
4. **Size Variants**: `sm`, `md`, `lg` remain available via the `size` prop, now applied as BEM classes (`chip--sm`, `chip--md`, `chip--lg`)
5. **Compound Variant Classes**: Variant + color combinations (e.g., `.chip--primary.chip--accent`, `.chip--soft.chip--success`) have built-in styles and are customizable via `@layer components`
6. **Radius Removed**: Use Tailwind CSS classes instead
7. **Avatar Prop Removed**: Use children directly
8. **Start/End Content Removed**: Use children directly
9. **Close Button Removed**: Implement manually with `CloseButton` component
10. **Dot Variant Removed**: Implement manually with icon
11. **Shadow Variant Removed**: Use Tailwind `shadow-*` classes
12. **Disabled Prop Removed**: Use conditional rendering or CSS classes
13. **ClassNames Removed**: Use `className` prop directly

</page>

---

# Divider Migration Guide

**Component:** divider
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/divider.mdx

---

<page url="/docs/react/migration/divider">
# Divider

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/divider
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/divider.mdx
> Migration guide for Divider (renamed to Separator) from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Separator documentation](/docs/react/components/separator) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Component Rename

**v2:** `Divider`\
**v3:** `Separator`

## Key Changes

### 1. Component Name

**v2:** `Divider`\
**v3:** `Separator`

### 2. Variant Prop

**v3:** Separator has a `variant` prop: `default`, `secondary`, `tertiary` for different emphasis levels (v2 Divider had no variant).

### 3. Props Comparison

| Prop          | v2 | v3 | Notes                                             |
| ------------- | -- | -- | ------------------------------------------------- |
| `orientation` | ✅  | ✅  | Same: `"horizontal"` \| `"vertical"`              |
| `className`   | ✅  | ✅  | Same                                              |
| `variant`     | ❌  | ✅  | New: `"default"` \| `"secondary"` \| `"tertiary"` |

## Structure Changes

In v2, the component was named `Divider`:

```tsx
import { Divider } from "@heroui/react";

export default function App() {
  return (
    <div>
      <p>Content above</p>
      <Divider />
      <p>Content below</p>
    </div>
  );
}

```

In v3, the component has been renamed to `Separator`:

```tsx
import { Separator } from "@heroui/react";

export default function App() {
  return (
    <div>
      <p>Content above</p>
      <Separator />
      <p>Content below</p>
    </div>
  );
}

```

## Migration Examples

### With Variant

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* v2 has no variant prop */}
    <Divider />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    <Separator />
    <Separator variant="secondary" />
    <Separator variant="tertiary" />
    ```
  </Tab>
</Tabs>

## Summary

1. **Component Renamed**: `Divider` → `Separator`
2. **Import Change**: Update import from `Divider` to `Separator`
3. **New in v3**: `variant` prop (`default`, `secondary`, `tertiary`) for emphasis levels

## Migration Steps

1. **Update Import**: Change `import { Divider }` to `import { Separator }`
2. **Update Component**: Replace all `<Divider />` with `<Separator />`
3. **Same Props**: `orientation` and `className` work the same
4. **Optional**: Use `variant="secondary"` or `variant="tertiary"` for different emphasis

</page>

---

# Input Migration Guide

**Component:** input
**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/input.mdx

---

<page url="/docs/react/migration/input">
# Input

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/input
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(components)/input.mdx
> Migration guide for Input from HeroUI v2 to v3


<Callout type="info">
  Refer to the [v3 Input documentation](/docs/react/components/input) for complete API reference, styling guide, and advanced examples. This guide only focuses on migrating from HeroUI v2.
</Callout>

## Key Change: Input → TextField

**v2:** `Input` was a full-featured component with built-in label, description, error messages, validation, variants, colors, sizes, etc.

**v3:** `Input` is now a primitive component (just the input element). For form fields, use `TextField` which wraps `Input` with `Label`, `Description`, and `FieldError` components. In v2 there was no separate TextField or InputGroup; the single Input component handled labels, descriptions, start/end content, and validation.

## When to Use Input vs TextField

### Use TextField (Most Cases)

Use `TextField` when you need:

* Labels
* Descriptions
* Error messages
* Validation
* Form integration

### Use Input (Primitive Only)

Use `Input` when you need:

* Just a basic input element
* Custom label/error handling
* Integration with custom form components

## Structure Changes

In v2, `Input` was a full-featured component that accepted props for label, description, placeholder, and other elements:

```tsx
import { Input } from "@heroui/react";

export default function App() {
  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      type="email"
    />
  );
}

```

In v3, `Input` is a primitive component. For form fields with labels and validation, use `TextField` which wraps `Input` with `Label`, `Description`, and `FieldError`:

```tsx
import { TextField, Label, Input, FieldError } from "@heroui/react";

export default function App() {
  return (
    <TextField name="email" type="email">
      <Label>Email</Label>
      <Input placeholder="Enter your email" />
      <FieldError />
    </TextField>
  );
}

```

## Key Changes

### 1. Component Split

**v2:** Single `Input` component with all features\
**v3:** Split into `Input` (primitive) and `TextField` (compound component)

### 2. Prop Changes

| v2 Prop                   | v3 Location            | Notes                                                                                                                                                                |
| ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                   | `Label`                | Use `Label` component inside `TextField`                                                                                                                             |
| `description`             | `Description`          | Use `Description` component inside `TextField`                                                                                                                       |
| `errorMessage`            | `FieldError`           | Use `FieldError` component inside `TextField`                                                                                                                        |
| `variant`                 | `Input`                | Changed from multiple variants (flat, bordered, underlined, faded) to `"primary"` (default, with shadow) and `"secondary"` (lower emphasis, no shadow, for surfaces) |
| `color`, `size`, `radius` | -                      | Removed (use Tailwind CSS)                                                                                                                                           |
| `fullWidth`               | `Input` or `TextField` | Still supported on both `Input` and `TextField` (`fullWidth` boolean prop)                                                                                           |
| `labelPlacement`          | -                      | Use layout with `Label`                                                                                                                                              |
| `startContent`            | `InputGroup.Prefix`    | Use `InputGroup` with `InputGroup.Prefix` inside `TextField`                                                                                                         |
| `endContent`              | `InputGroup.Suffix`    | Use `InputGroup` with `InputGroup.Suffix` inside `TextField`                                                                                                         |
| `isClearable`             | -                      | Implement manually with button                                                                                                                                       |
| `isRequired`, `isInvalid` | `TextField`            | Use on `TextField`                                                                                                                                                   |
| `validate`                | `TextField`            | Use `validate` on `TextField`                                                                                                                                        |
| `classNames`              | -                      | Use `className` on individual components                                                                                                                             |
| `onValueChange`           | `Input`                | Use `onChange` event handler                                                                                                                                         |

## Migration Examples

### Form Validation

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    {/* With description */}
    <Input
      description="We'll never share your email"
      label="Email"
      type="email"
    />

    {/* With error message */}
    <Input
      errorMessage="Please enter a valid email"
      isInvalid
      label="Email"
      type="email"
    />

    {/* Required */}
    <Input isRequired label="Email" type="email" />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { Description } from "@heroui/react";

    {/* With description */}
    <TextField name="email" type="email">
      <Label>Email</Label>
      <Input />
      <Description>We'll never share your email</Description>
      <FieldError />
    </TextField>

    {/* With error message */}
    <TextField
      isInvalid
      name="email"
      type="email"
      validate={(value) => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return "Please enter a valid email";
        }
        return null;
      }}
    >
      <Label>Email</Label>
      <Input />
      <FieldError />
    </TextField>

    {/* Required */}
    <TextField isRequired name="email" type="email">
      <Label>Email</Label>
      <Input />
      <FieldError />
    </TextField>
    ```
  </Tab>
</Tabs>

### Input with Start/End Content

For inputs with prefix or suffix content, use the **InputGroup** compound component:

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Input
      label="Price"
      startContent={<span>$</span>}
      type="number"
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { InputGroup } from "@heroui/react";

    <TextField name="price" type="number">
      <Label>Price</Label>
      <InputGroup>
        <InputGroup.Prefix>$</InputGroup.Prefix>
        <InputGroup.Input />
      </InputGroup>
      <FieldError />
    </TextField>
    ```
  </Tab>
</Tabs>

**InputGroup** provides proper styling and layout for prefix/suffix content. Use:

* `InputGroup.Prefix` for content before the input (replaces `startContent`)
* `InputGroup.Suffix` for content after the input (replaces `endContent`)
* `InputGroup.Input` for the input element itself

### Input with Clear Button

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    <Input
      isClearable
      label="Email"
      onClear={() => console.log("cleared")}
      type="email"
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";
    import { CloseButton } from "@heroui/react";

    const [value, setValue] = useState("");

    <TextField name="email" type="email">
      <Label>Email</Label>
      <div className="flex items-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        {value && (
          <CloseButton
            aria-label="Clear"
            onPress={() => setValue("")}
          />
        )}
      </div>
      <FieldError />
    </TextField>
    ```
  </Tab>
</Tabs>

### Controlled Input

<Tabs items={["v2", "v3"]}>
  <Tab value="v2">
    ```tsx
    import { useState } from "react";

    const [value, setValue] = useState("");

    <Input
      label="Email"
      onValueChange={setValue}
      type="email"
      value={value}
    />
    ```
  </Tab>

  <Tab value="v3">
    ```tsx
    import { useState } from "react";

    const [value, setValue] = useState("");

    <TextField name="email" type="email">
      <Label>Email</Label>
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <FieldError />
    </TextField>
    ```
  </Tab>
</Tabs>

## Summary

1. **Component Split**: `Input` → `TextField` for form fields, `Input` for primitive input
2. **Label Required**: Must use `Label` component instead of `label` prop
3. **Error Display**: Must use `FieldError` component instead of `errorMessage` prop
4. **Description**: Must use `Description` component instead of `description` prop
5. **Validation**: Move `validate` function from `Input` to `TextField`
6. **Start/End Content**: Use `InputGroup` with `InputGroup.Prefix`/`InputGroup.Suffix` inside `TextField`
7. **Clear Button**: Implement manually with `CloseButton`
8. **Variants Simplified**: v2 had multiple variants (flat, bordered, underlined, faded); v3 has `"primary"` (default) and `"secondary"` (for surfaces)
9. **Full Width**: `fullWidth` prop is still available on both `Input` and `TextField`
10. **Colors Removed**: Use Tailwind CSS classes
11. **Sizes Removed**: Use Tailwind CSS classes
12. **Radius Removed**: Use Tailwind CSS classes
13. **onValueChange Removed**: Use `onChange` event handler
14. **ClassNames Removed**: Use `className` props on individual components

</page>
