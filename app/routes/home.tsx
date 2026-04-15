import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
          <div className="mt-4">
            <Link to="/todos" className="text-primary underline">
              Go to Todos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
