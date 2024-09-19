import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupSchema } from "@backend/constants/schemas/users"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

export function SignupForm() {

    type SignUpValues = z.infer<typeof signupSchema>

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {},
      })
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 grid-cols-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              </form>
            </Form>
            )
}