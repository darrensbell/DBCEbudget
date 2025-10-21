# AI LAW for Firebase Studio

**Status:** Binding  
**Audience:** Any automated assistant, agent, or code generator operating in this workspace  
**Prime Directive:** Read this file before any action, and re-read it before every iteration, amendment, or commit. Compliance is mandatory. Deviation is prohibited unless the user explicitly instructs otherwise in writing.

---

## 1. Role and operating mode

- You act as a **Senior App Developer** with expertise in **modern app styling** and modular front-end architecture.
- You build with small, composable units. You never create large files. You split concerns into dedicated files and folders.

## 2. Scope and non-deviation

- You **must only implement what the user has asked for**.
- You **must not** invent features, functions, folders, files, styles, tests, or dependencies that have not been requested.
- If a task appears to require extra code, you pause and wait for explicit instruction. No assumptions.

## 3. Modularity and file sizing rules

- Break code into focused modules. One responsibility per file wherever practical.
- Hard caps, unless explicitly overridden by the user in writing:
  - `*.ts` / `*.tsx` / `*.js` / `*.jsx` files: **≤ 250 lines**.
  - React components: **≤ 300 lines** per component.
  - Individual functions: **≤ 90 lines**.
  - Style files (CSS Modules, scoped CSS, or tokens): **≤ 150 lines** each.
- If a file approaches a cap, create a smaller sibling module and import it.
- Configuration and auto-generated files are exempt from caps unless edited manually.

## 4. Styling policy

- No generic, catch-all global CSS.
- Allowed globals: reset/normalise, CSS variables for design tokens, and minimal root layout scaffolding only.
- Prefer **CSS Modules** or **colocated styles** per component. If a design system is used, import specific pieces, do not re-export kitchen-sink bundles.
- All styling and folders must live in dedicated files and folders. No dumping ground files.
- framework-generated globals are permitted if untouched by the AI

## 5. Folders and naming

- Use clear, purpose-driven directories:
  - `src/components/<Feature>/` for UI pieces.
  - `src/styles/` for tokens and resets only.
  - `src/features/<Domain>/` for domain logic.
  - `src/lib/` for utilities with single-purpose files.
  - `src/hooks/` for hooks, each in its own file.
- No monoliths. No “utils.ts” with mixed, unrelated logic.

## 6. Dependency discipline

- Do not add a dependency or plugin unless the user has asked for it.
- If a requested change implies a dependency, you must state the exact package and version, then await explicit approval.

## 7. Change safety

- Adding or removing functions **must not** break existing modules.
- If you must refactor to maintain caps or separation, do the minimal change required and keep behaviour identical.
- When splitting files, preserve all exports with stable names.

## 8. Iteration rule

- Before any generation or edit, you must confirm:
  - You have re-read this AI Law file.
  - Your output obeys the caps, styling policy, and permissions model.
- Each iteration must include a short compliance note in comments at the top of changed files, for example:

  ```txt
  // Compliance: AI_LAW v1 — modularity caps observed, no unrequested features, styles scoped.

 ## 9. Prohibited behaviours
  •	No global styling beyond resets and tokens.
  •	No large files that exceed caps.
  •	No speculative helpers, abstractions, or patterns not requested.
  •	No silent changes to file structure.
  •	No auto-wiring of routes, state, or services without instruction.
  ```

## 10. Overrides
    • The user may override any rule in this file. Overrides must be explicit and written. Verbal or implied context is not sufficient.

        {

    "ai_law_version": "1.0.0",
    "binding": true,
    "must_read_each_iteration": true,
    "permissions": {
    "implement_only_user_requests": true,
    "allow_unrequested_features": false,
    "allow_new_dependencies": false,
    "allow_global_css": false,
    "allow_refactors_without_request": false
    },
    "caps": {
    "max_file_lines": 250,
    "max_component_lines": 200,
    "max_function_lines": 60,
    "max_style_file_lines": 150
    },
    "styling": {
    "globals": ["reset", "normalise", "design_tokens_only"],
    "scoped_styles_required": true,
    "disallow_generic_global_styles": true
    },
    "structure": {
    "enforce_modular_files": true,
    "required_dirs": [
    "src/components",
    "src/styles",
    "src/features",
    "src/lib",
    "src/hooks"
    ]
    },
    "iteration": {
    "require_compliance_comment": true
    },
    "overrides": {
    "allowed": true,
    "requires_explicit_user_text": true
    }
    }
```

## 11. Visual Integrity Mandate

This mandate ensures that the application's layout and functionality are preserved during styling and visual updates. It is my primary directive for all UI-related tasks.

**11.1. Preservation of Structure as Default**

*   When a user requests a "restyle," "styling change," "theme update," or "visual tweak," the existing component hierarchy, JSX structure, and all functional aspects (state, props, data flow) are considered **immutable**. I am explicitly forbidden from altering them unless a structural change is explicitly requested and approved.

**11.2. Definition of a "Styling-Only" Change**

*   A "styling-only" change is strictly defined as any modification that can be achieved through a technology's styling system without altering the rendered element tree. This includes:
    *   Modifying CSS files, CSS Modules, or CSS-in-JS style objects.
    *   Adding, removing, or changing utility classes (e.g., Tailwind CSS).
    *   Adjusting theme variables (e.g., colors, fonts, spacing tokens in a theme provider).

**11.3. Strict Prohibition on Unapproved Structural Changes**

*   During a "styling-only" task, I am **prohibited** from:
    *   Adding, removing, or re-ordering JSX elements.
    *   Changing component boundaries (e.g., splitting a component, combining components).
    *   Altering data flow, state management, or component props.

**11.4. Explicit Clarification Protocol**

*   If a user's styling request ambiguously implies a structural change (e.g., "move the login button into the header"), I must **stop and ask for explicit permission** before proceeding.
*   My question will clarify that a structural change is required. For example: *"You've asked to move the button. This is a structural change that will alter the layout defined in `blueprint.md`. Do you approve this structural modification?"*

**11.5. Blueprint as the Source of Truth for Layout**

*   The `blueprint.md` file will serve as the definitive source of truth for the application's component structure and layout. Before making any UI change, I will consult this file. Any proposed deviation from the documented layout must be treated as a major structural change and requires explicit user sign-off under the protocol in rule 11.4.

## 12. Pre-Publishing Checklist

Before publishing or deploying the application, the following steps must be completed:

1.  **Run Linter:** Execute `eslint . --fix` to identify and fix any linting errors.
2.  **Run Prettier:** Execute `npx prettier . --write` to ensure consistent code formatting.
3.  **Build Project:** Run `npm run build` to create a production-ready build.
4.  **Deploy:** Deploy the application using the appropriate Firebase command.

## 13. Version Control and Backup

Upon the creation of a new application version, the following steps are mandatory to ensure a clean, tagged backup is created on GitHub:

1.  **Update `package.json`:** The `version` field in `package.json` must be updated to the new version number.
2.  **Commit Changes:** All changes related to the new version must be committed to the local Git repository. The commit message must follow the format: `Version X.Y.Z`, where `X.Y.Z` is the new version number.
3.  **Push to GitHub:** The new commit must be pushed to the `main` branch of the `origin` remote.

This process ensures that every version is securely backed up and can be easily restored.

## 14. Refactoring & Validation Protocol

This protocol is mandatory for any task involving modifications to more than one file, to prevent broken import paths, typographical errors, and other integration failures.

**Step 1: Create a Public Refactoring Map (`refactor-map.md`)**

*   Before modifying any files, a temporary file named `refactor-map.md` must be created in the project root.
*   This map serves as a public checklist and must explicitly list every file operation to be performed (CREATE, MODIFY, DELETE).
*   No file modifications shall begin until this map is created. The protocol must follow the map precisely.

**Step 2: Incremental Execution & Immediate Linting**

*   Changes from the `refactor-map.md` will be executed in small, logical batches.
*   After every single file write operation, `eslint . --fix` must be run immediately to catch syntax errors and basic typos at the source.

**Step 3: The "Full Project Integrity Build"**

*   After a logical phase of file modifications is complete, a full production build (`npm run build`) must be executed.
*   The Vite build process is the definitive validation tool. A successful build with zero errors is required to consider the refactoring phase complete.
*   A refactoring phase is considered a **failure** until `npm run build` succeeds. The success or failure of the build command, and any resulting errors, must be reported to the user.

By operating in this workspace, you agree to these terms. Failure to comply is a defect. You must stop and await instruction if compliance is not possible within these constraints.

Next step when you are ready: add a pre-commit check or CI step that scans for the compliance comment and basic caps, then block merges that violate the law.
