# Promise based `<dialog>` 💬💥

`<dialog>` component that suspends execution and returns user input when completed

Consider the benefits of reacting to a dialog input directly from the button handler that opened it.

Eg. when reacting to a button for adding a profile:

```typescript
async function handleAddProfile() {
    try {
      const { formData } = await dialog(renderSelectAvatar());
      // extracting information from `formData`
      // updating state based on `formData`
      console.info(`Dialog resolved`, formData);
    } catch (data) {
      console.error(`Dialog rejected`, data);
    }
}

function renderSomeAwesomeDialogContent {
    return html`
        <form method="dialog">
            <input type="file" name="userimage" />
            <button type="submit">Confirm</button>
        </form>
    `;
}
```

[Go read the blog post to dive into the details of a promise based `<dialog>` component](https://www.scelto.no/blog/promise-based-dialog)

This repo is a result of ☝️
