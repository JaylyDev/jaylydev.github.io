# HeroUI v2 to v3 Agent Migration Guide - Full Migration

**Source:** https://heroui-git-docs-migration-heroui.vercel.app/docs/react/migration/agent-guide-full.mdx

---

<page url="/docs/react/migration/agent-guide-full">
# Agent Migration Guide - Full Migration

**Category**: react
**URL**: https://v3.heroui.com/docs/react/migration/agent-guide-full
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/react/migration/(workflows)/agent-guide-full.mdx
> Full migration guide for AI assistants helping migrate HeroUI v2 to v3


<Callout type="warning">
  HeroUI v3 is currently in **beta**. Expect breaking changes before the stable release. Test thoroughly in a development environment before migrating production applications.
</Callout>

## Overview

This guide is designed for AI assistants (agents) helping users migrate from HeroUI v2 to v3. It implements a **full migration approach** that analyzes the project first and migrates components in manageable batches rather than all at once.

<Callout type="warning">
  **Critical Constraint**: HeroUI v2 and v3 **should not coexist** in the same project. The project will be broken during migration. Always work in a feature branch and migrate all component code before switching dependencies.
</Callout>

## Key Principles

1. **Full Migration**: Never migrate all components at once. Large projects require full migration.
2. **Project Analysis First**: Always analyze the codebase to understand component usage before creating a migration plan.
3. **Broken State Management**: **Critical**: The project will be broken during migration. Plan for this by:
   * Migrating in a feature branch
   * Preparing all code changes before switching dependencies
   * Having a rollback plan
   * Testing in isolated environment first
4. **All-or-Nothing Dependency Switch**: Once dependencies are updated to v3, ALL components must be migrated. Plan component migrations before switching dependencies.

## Major Changes in v3

## Major Changes

<section id="major-changes">
  * **Dependencies**: Update React to v19+, HeroUI packages to v3, Tailwind CSS to v4, remove Framer Motion
  * **No Provider Required**: v3 removes the need for `HeroUIProvider`
  * **Component API Updates**: Many components use React Aria Components patterns
  * **Compound Components**: New compound component patterns for better customization. See individual component guides for details.
  * **Hooks Removed**: v2 component hooks like `useSwitch` or `useInput` are removed - use compound components instead. `useDisclosure` is replaced with `useOverlayState`. See the [Hooks Migration Guide](/docs/react/migration/hooks) for details.
  * **Configuration**: Remove `heroui()` plugin from Tailwind config, update CSS imports, remove `hero.ts` file
  * **Item identity**: Collection items (Dropdown, Listbox, Select, Accordion, etc.) now use `id` and `textValue` in v3; keep React's `key` for lists.
</section>

## Detailed Migration Steps

For detailed step-by-step instructions, see the [Full Migration Guide](/docs/react/migration/full-migration). The guide covers:

* Dependency updates
* Theming configuration changes
* Removing HeroUIProvider
* Component imports and migration
* Hooks migration
* Styling migration
* Testing

**Agent Note**: Dependency updates (React 19, Tailwind v4) can be done before switching HeroUI (won't break project). However, the HeroUI package switch should only happen AFTER all component code is migrated.

## Hooks Migration

HeroUI v2 provided component hooks (like `useSwitch`, `useInput`, `useCheckbox`, etc.) and utility hooks like `useDisclosure`. HeroUI v3 removes most component hooks in favor of compound components, and replaces `useDisclosure` with `useOverlayState`.

**When to migrate hooks:**

* **During component migration**: Replace component hooks (`useSwitch`, `useInput`, etc.) as you migrate each component to use compound components
* **After component migration**: Migrate `useDisclosure` → `useOverlayState` for overlay state management before styling migration

**Migration Strategy:**

1. **Identify hook usage**: Search codebase for imports from `@heroui/react` that include hook names (`useSwitch`, `useInput`, `useCheckbox`, `useRadio`, `useDisclosure`, etc.)
2. **Replace component hooks**: Use compound components instead of hooks with prop getters (done during component migration)
3. **Replace useDisclosure**: Migrate to `useOverlayState` for overlay state management (use `get_hooks_migration_guide` MCP tool)
4. **Reference guides**: Use `get_hooks_migration_guide` MCP tool for hooks migration, `get_component_migration_guides` for component-specific guides

## Component Import Changes

See the [Full Migration Guide](/docs/react/migration/full-migration#step-5-update-component-imports) for detailed component import changes.

## Component Migration Reference

Use the table below to quickly find migration guidance for each component. Use the link in the "Migration Guide" column to jump to detailed migration instructions.

<Callout>
  **Component Development Status**: Components marked with 🔄 In Progress or 📋 Planned are still being developed. Check the [Roadmap](https://herouiv3.featurebase.app/roadmap) for the task status. Guides for these components will be available once development is finished.
</Callout>

| v2 Component     | v3 Component                 | Status      | Migration Guide                                                           |
| ---------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------- |
| Accordion        | Accordion                    | ✅ Available | [View guide →](/docs/react/migration/accordion)                           |
| Alert            | Alert                        | ✅ Available | [View guide →](/docs/react/migration/alert)                               |
| Autocomplete     | ComboBox                     | ✅ Renamed   | [View guide →](/docs/react/migration/autocomplete)                        |
| Avatar           | Avatar                       | ✅ Available | [View guide →](/docs/react/migration/avatar)                              |
| Badge            | Badge                        | ✅ Available | [View guide →](/docs/react/migration/badge)                               |
| Breadcrumbs      | Breadcrumbs                  | ✅ Available | [View guide →](/docs/react/migration/breadcrumbs)                         |
| Button           | Button                       | ✅ Available | [View guide →](/docs/react/migration/button)                              |
| ButtonGroup      | ButtonGroup                  | ✅ Available | [View guide →](/docs/react/migration/button-group)                        |
| Calendar         | Calendar                     | ✅ Available | [View guide →](/docs/react/migration/calendar)                            |
| Card             | Card                         | ✅ Available | [View guide →](/docs/react/migration/card)                                |
| Checkbox         | Checkbox                     | ✅ Available | [View guide →](/docs/react/migration/checkbox)                            |
| CheckboxGroup    | CheckboxGroup                | ✅ Available | [View guide →](/docs/react/migration/checkbox-group)                      |
| Chip             | Chip                         | ✅ Available | [View guide →](/docs/react/migration/chip)                                |
| Code             | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/code)                                |
| DateInput        | DateField                    | ✅ Renamed   | [View guide →](/docs/react/migration/dateinput)                           |
| DatePicker       | DatePicker                   | ✅ Available | [View guide →](/docs/react/migration/date-picker)                         |
| DateRangePicker  | DateRangePicker              | ✅ Available | [View guide →](/docs/react/migration/date-range-picker)                   |
| TimeInput        | TimeField                    | ✅ Renamed   | [View guide →](/docs/react/migration/timeinput)                           |
| Divider          | Separator                    | ✅ Renamed   | [View guide →](/docs/react/migration/divider)                             |
| Drawer           | Drawer                       | ✅ Available | [View guide →](/docs/react/migration/drawer)                              |
| Dropdown         | Dropdown                     | ✅ Available | [View guide →](/docs/react/migration/dropdown)                            |
| Form             | Form                         | ✅ Available | [View guide →](/docs/react/migration/form)                                |
| Image            | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/image)                               |
| Input            | TextField, Input, InputGroup | ✅ Available | [View guide →](/docs/react/migration/input)                               |
| InputOTP         | InputOTP                     | ✅ Available | [View guide →](/docs/react/migration/input-otp)                           |
| Kbd              | Kbd                          | ✅ Available | [View guide →](/docs/react/migration/kbd)                                 |
| Link             | Link                         | ✅ Available | [View guide →](/docs/react/migration/link)                                |
| Listbox          | ListBox                      | ✅ Available | [View guide →](/docs/react/migration/listbox)                             |
| Modal            | Modal                        | ✅ Available | [View guide →](/docs/react/migration/modal)                               |
| Navbar           | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/navbar)                              |
| NumberInput      | NumberField                  | ✅ Renamed   | [View guide →](/docs/react/migration/numberinput)                         |
| Pagination       | Pagination                   | ✅ Available | [View guide →](/docs/react/migration/pagination)                          |
| Popover          | Popover                      | ✅ Available | [View guide →](/docs/react/migration/popover)                             |
| Progress         | ProgressBar                  | ✅ Renamed   | [View guide →](/docs/react/migration/progress)                            |
| CircularProgress | ProgressCircle               | ✅ Renamed   | [View guide →](/docs/react/migration/circular-progress)                   |
| Radio            | Radio                        | ✅ Available | [View guide →](/docs/react/migration/radio)                               |
| RadioGroup       | RadioGroup                   | ✅ Available | [View guide →](/docs/react/migration/radio-group)                         |
| RangeCalendar    | RangeCalendar                | ✅ Available | [View guide →](/docs/react/migration/range-calendar)                      |
| Ripple           | ❌                            | ❌ Removed   | [See Button ripple →](/docs/react/components/button#adding-ripple-effect) |
| ScrollShadow     | ScrollShadow                 | ✅ Available | [View guide →](/docs/react/migration/scroll-shadow)                       |
| Select           | Select                       | ✅ Available | [View guide →](/docs/react/migration/select)                              |
| Skeleton         | Skeleton                     | ✅ Available | [View guide →](/docs/react/migration/skeleton)                            |
| Slider           | Slider                       | ✅ Available | [View guide →](/docs/react/migration/slider)                              |
| Snippet          | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/snippet)                             |
| Spacer           | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/spacer)                              |
| Spinner          | Spinner                      | ✅ Available | [View guide →](/docs/react/migration/spinner)                             |
| Switch           | Switch                       | ✅ Available | [View guide →](/docs/react/migration/switch)                              |
| Table            | Table                        | ✅ Available | [View guide →](/docs/react/migration/table)                               |
| Tabs             | Tabs                         | ✅ Available | [View guide →](/docs/react/migration/tabs)                                |
| Toast            | Toast                        | ✅ Available | [View guide →](/docs/react/migration/toast)                               |
| Tooltip          | Tooltip                      | ✅ Available | [View guide →](/docs/react/migration/tooltip)                             |
| User             | ❌                            | ❌ Removed   | [View guide →](/docs/react/migration/user)                                |

<Callout type="info">
  **Removed/In-Progress/Planned Components**: For components marked as ❌ Removed, 🔄 In Progress, or 📋 Planned, replace them with standard HTML elements during migration. You can migrate back to HeroUI components once they become available in v3.
</Callout>

Use the `get_component_migration_guides` MCP tool to fetch detailed guides for each component.

## New Components in v3

## New Components in v3

<section id="new-components-in-v3">
  v3 introduces a number of new components not available in v2:

  | Component       | Purpose                                                                              | Documentation                                          |
  | --------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
  | TextField       | Enhanced text input with label and description support                               | [View docs →](/docs/react/components/text-field)       |
  | TextArea        | Multi-line text input component                                                      | [View docs →](/docs/react/components/text-area)        |
  | AlertDialog     | Modal dialog for confirmations and alerts                                            | [View docs →](/docs/react/components/alert-dialog)     |
  | Label           | Accessible form label component                                                      | [View docs →](/docs/react/components/label)            |
  | Description     | Helper text for form fields                                                          | [View docs →](/docs/react/components/description)      |
  | FieldError      | Form field error message display                                                     | [View docs →](/docs/react/components/field-error)      |
  | Fieldset        | Group related form fields                                                            | [View docs →](/docs/react/components/fieldset)         |
  | InputGroup      | Compose multiple inputs together                                                     | [View docs →](/docs/react/components/input-group)      |
  | Surface         | Container component with elevation styles                                            | [View docs →](/docs/react/components/surface)          |
  | Disclosure      | Expandable/collapsible content sections                                              | [View docs →](/docs/react/components/disclosure)       |
  | DisclosureGroup | Compound component for multiple disclosure sections                                  | [View docs →](/docs/react/components/disclosure-group) |
  | SearchField     | Search input with clear button and optional loading state                            | [View docs →](/docs/react/components/search-field)     |
  | DateField       | Date input with calendar picker                                                      | [View docs →](/docs/react/components/date-field)       |
  | TimeField       | Time input component                                                                 | [View docs →](/docs/react/components/time-field)       |
  | Tag, TagGroup   | Tags and tag group for selection or display                                          | [View docs →](/docs/react/components/tag-group)        |
  | ColorPicker     | Color selection (ColorArea, ColorField, ColorSlider, ColorSwatch, ColorSwatchPicker) | [View docs →](/docs/react/components/color-picker)     |
  | CloseButton     | Dismiss or close trigger button                                                      | [View docs →](/docs/react/components/close-button)     |
  | ErrorMessage    | Form field error display (React Aria integration)                                    | [View docs →](/docs/react/components/error-message)    |
</section>

## Custom Theme Overrides

See the [Full Migration Guide](/docs/react/migration/full-migration#step-7-update-custom-theme-overrides) for custom theme override migration.

## Styling Migration

See the [Full Migration Guide](/docs/react/migration/full-migration#step-9-styling-migration) for detailed styling migration instructions.

**Agent Note**: Use the `get_styling_migration_guide` MCP tool for comprehensive styling migration details.

**Important**: Styling migration happens AFTER component migration and dependency switch.

## Full Migration Workflow

**IMPORTANT**: Since v2 and v3 cannot coexist, the migration happens in two main stages:

1. **Preparation Stage**: Migrate all component code while still on v2 dependencies (code will be broken)
2. **Switch Stage**: Update dependencies to v3 and fix any remaining issues

**⚠️ CRITICAL: Don't build to check for errors during migration**

* Use **typecheck** (e.g., `tsc --noEmit`) if available to check TypeScript errors
* Use **lint** (e.g., `eslint`, `biome check`) if available to check code quality
* **DO NOT** run build commands (e.g., `npm run build`, `next build`, `vite build`)
* **DO NOT** attempt to start/run the project during migration

### Phase 0: Setup and Analysis

1. **Create migration branch**
   * Create a feature branch for migration work
   * Example: `git checkout -b migrate/heroui-v3`

2. **Verify Migration MCP is configured**
   * Check that Migration MCP server is connected
   * Ensure `heroui-react` MCP is NOT connected (to avoid confusion)
   * Verify MCP tools are available

3. **Analyze the project and create a migration plan**
   * Use `get_migration_workflow` to fetch this guide
   * Scan for HeroUI v2 imports, identify all components and usage
   * Map component dependencies
   * Create a phased migration plan (e.g., 3-5 components per phase, by-dependency strategy)

### Phase 1: Dependency Preparation (Before Code Changes)

These steps can be done before switching HeroUI dependencies and won't break the project:

1. **Update React to v19** (if not already)
   * This can be done before switching HeroUI

2. **Update Tailwind CSS to v4** (if not already)
   * This can be done before switching HeroUI

3. **🛑 CHECKPOINT: Stop and wait for user approval**
   * **DO NOT proceed to next phase automatically**
   * Explain configuration changes
   * Wait for explicit user approval before continuing

### Phase 2-N: Code Migration (v2 Dependencies Still Active)

**Critical**: During this phase, code will reference v3 APIs but v2 dependencies are still installed. The project will be broken. This is expected and normal.

For each component group in the migration plan:

1. **Fetch component-specific guides**
   * Use `get_component_migration_guides` MCP tool for each component
   * Review API changes, prop migrations, structure changes

2. **Apply code migrations**
   * Migrate component code to v3 API patterns
   * Update imports, props, component structure
   * **Note**: Code will be broken until dependencies are switched

3. **Handle dependencies**
   * If components have dependencies, migrate dependencies first
   * Check if dependencies are already migrated
   * Migrate shared code as needed

4. **🛑 CHECKPOINT: Stop and wait for user approval**
   * **DO NOT proceed to next phase automatically**
   * Summarize what was migrated in this phase
   * Wait for explicit user approval before continuing

5. **Document migration status**
   * Track which components have been migrated
   * Note any issues or concerns

### Phase Final: Dependency Switch and Fixes

**Critical**: Only proceed when ALL components have been migrated to v3 API patterns.

1. **Update dependencies**
   * Remove `@heroui/react` and `@heroui/theme` (v2)
   * Install `@heroui/react@beta` and `@heroui/styles@beta` (v3)
   * Remove `framer-motion` if present
   * Update CSS imports (add `@import "@heroui/styles";`)
   * Remove HeroUIProvider from app root
   * Update Tailwind config (remove `heroui()` plugin)

2. **Fix remaining issues**
   * Run typecheck/lint if available (do NOT build)
   * Fix any TypeScript errors reported by typecheck
   * Fix any linting errors
   * Note: Do not attempt to build or run the project during migration

3. **🛑 CHECKPOINT: Stop and wait for user approval**
   * **DO NOT proceed to styling automatically**
   * Verify components work correctly
   * Wait for explicit user approval before styling migration

4. **Continue with styling migration**
   * Use `get_styling_migration_guide` MCP tool to fetch styling guide
   * Apply styling updates systematically

5. **Apply styling updates**
   * Use `get_styling_migration_guide` MCP tool
   * Update utility classes, color tokens, CSS variables
   * Test visual appearance

6. **Final verification**
   * Run typecheck/lint one final time (do NOT build)
   * Verify all styling updated correctly
   * Note: Full testing (visual, functionality, accessibility) should be done after migration is complete, not during migration

## Migration Strategies

### Strategy 1: By Dependency (Recommended)

* Migrate foundational components first (Button, Input, Card, etc.)
* Then migrate components that depend on them
* Best for projects with complex component hierarchies
* Ensures dependencies are ready before dependents

**Example order**:

1. Button, Input, Link (foundational)
2. Card, Modal (use Button)
3. Form, Dropdown (use Input, Button)
4. Complex components (use multiple dependencies)

### Strategy 2: By Feature

* Migrate all components in a feature/module together
* Good for feature-based code organization
* Allows feature-by-feature testing
* May require migrating dependencies first

**Example**:

* Feature: User Authentication
  * Migrate: Input, Button, Form, Modal (all auth-related)
* Feature: Dashboard
  * Migrate: Card, Tabs, Select (all dashboard-related)

### Strategy 3: By Frequency

* Migrate most-used components first
* Provides quick wins and early validation
* Good for large codebases with clear usage patterns
* Still need to handle dependencies

**Example**:

1. Button (used 150 times)
2. Input (used 120 times)
3. Card (used 80 times)
4. ... (continue by usage count)

## Best Practices for Agents

1. **Warn about broken state**
   * Always inform user that project will be broken during migration
   * Recommend using a feature branch
   * Set expectations about when project will work again

2. **Migrate all code before switching dependencies**
   * Complete all component code migrations first
   * Only switch dependencies when ALL components are migrated
   * This minimizes the broken state duration

3. **Use MCP tools for each phase**
   * Use `get_migration_workflow`, `get_component_migration_guides`, `get_styling_migration_guide` as needed
   * **Critical**: Always stop at checkpoints and wait for user approval between phases

4. **Work in a feature branch**
   * Always recommend creating a migration branch
   * Allow user to continue working on main branch
   * Enable easy rollback if needed

5. **Document migration status**
   * Track which components have been migrated
   * Note any issues or concerns
   * Keep a checklist visible
   * Update status after each phase

6. **Handle errors gracefully**
   * If a component migration fails, document why
   * Continue with other components
   * Return to failed components after dependency switch
   * Some issues may resolve once dependencies are updated

7. **Verify after dependency switch**
   * Only after dependencies are updated to v3
   * Run typecheck/lint (do NOT build)
   * Fix type/lint errors as they arise
   * Don't proceed to styling until typecheck/lint passes

## Common Scenarios

### Large Project (100+ components)

* Use smaller batch sizes (3-5 components)
* Prioritize by dependency or frequency
* Allow for multiple sessions
* Create checkpoints between phases
* Use "by-dependency" strategy
* Document progress clearly

### Small Project (\<20 components)

* Can use larger batches (5-10 components)
* May complete in fewer phases
* Still verify incrementally (full migration approach)
* Can use any strategy
* Still need to migrate all code before switching deps

### Mixed v2/v3 Usage (Full Migration)

* **Not possible in full migration**: v2 and v3 cannot coexist in full migration approach
* Must migrate all components before switching dependencies
* Use feature branch to maintain working main branch
* Complete migration in one go

## Next Steps

After completing migration:

1. Remove v2 dependencies (already done in dependency switch)
2. Switch from Migration MCP to `heroui-react` MCP for v3 development
3. Update documentation references
4. Run final verification
5. Merge migration branch to main

<Callout type="info">
  This agent migration guide is designed to work with the Migration MCP server. Ensure the MCP server is properly configured and tools are available before starting migration.
</Callout>

</page>
