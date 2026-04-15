import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/todos")
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test("shows heading and empty state", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible()
  await expect(page.getByText("No todos yet. Add one above!")).toBeVisible()
})

test("adds a new todo", async ({ page }) => {
  await page.getByLabel("New todo").fill("Buy milk")
  await page.getByRole("button", { name: "Add todo" }).click()

  await expect(page.getByText("Buy milk")).toBeVisible()
  await expect(page.getByText("No todos yet")).not.toBeVisible()
})

test("does not add empty todos", async ({ page }) => {
  await page.getByRole("button", { name: "Add todo" }).click()

  await expect(page.getByText("No todos yet. Add one above!")).toBeVisible()
})

test("adds todo via Enter key", async ({ page }) => {
  await page.getByLabel("New todo").fill("Walk the dog")
  await page.getByLabel("New todo").press("Enter")

  await expect(page.getByText("Walk the dog")).toBeVisible()
})

test("clears input after adding", async ({ page }) => {
  const input = page.getByLabel("New todo")
  await input.fill("Read a book")
  await page.getByRole("button", { name: "Add todo" }).click()

  await expect(input).toHaveValue("")
})

test("toggles todo complete/incomplete", async ({ page }) => {
  await page.getByLabel("New todo").fill("Exercise")
  await page.getByRole("button", { name: "Add todo" }).click()

  const toggle = page.getByLabel("Toggle Exercise")
  await toggle.click()
  await expect(toggle).toHaveAttribute("data-state", "checked")

  await toggle.click()
  await expect(toggle).toHaveAttribute("data-state", "unchecked")
})

test("deletes a todo", async ({ page }) => {
  await page.getByLabel("New todo").fill("Clean house")
  await page.getByRole("button", { name: "Add todo" }).click()

  await expect(page.getByText("Clean house")).toBeVisible()

  await page.getByRole("button", { name: "Delete Clean house" }).click()

  await expect(page.getByText("Clean house")).not.toBeVisible()
  await expect(page.getByText("No todos yet. Add one above!")).toBeVisible()
})

test("manages multiple todos independently", async ({ page }) => {
  const input = page.getByLabel("New todo")
  const addBtn = page.getByRole("button", { name: "Add todo" })

  await input.fill("Task A")
  await addBtn.click()
  await input.fill("Task B")
  await addBtn.click()
  await input.fill("Task C")
  await addBtn.click()

  await expect(page.getByText("Task A")).toBeVisible()
  await expect(page.getByText("Task B")).toBeVisible()
  await expect(page.getByText("Task C")).toBeVisible()

  // Toggle only Task B
  await page.getByLabel("Toggle Task B").click()
  await expect(page.getByLabel("Toggle Task B")).toHaveAttribute(
    "data-state",
    "checked"
  )
  await expect(page.getByLabel("Toggle Task A")).toHaveAttribute(
    "data-state",
    "unchecked"
  )
  await expect(page.getByLabel("Toggle Task C")).toHaveAttribute(
    "data-state",
    "unchecked"
  )

  // Delete Task A
  await page.getByRole("button", { name: "Delete Task A" }).click()
  await expect(page.getByText("Task A")).not.toBeVisible()
  await expect(page.getByText("Task B")).toBeVisible()
  await expect(page.getByText("Task C")).toBeVisible()
})
