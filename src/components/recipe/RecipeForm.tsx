// Recipe form shared by create and edit. react-hook-form handles state and validation;
// useFieldArray manages the ingredient and step rows; useImageUpload handles the photo.
import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useImageUpload } from '@/hooks/useImageUpload'
import { PhotoPicker } from './PhotoPicker'
import { CATEGORIES, UNITS, type Category, type Recipe, type RecipeInput, type Unit } from '@/lib/types'

type FormValues = {
  title: string
  description: string
  category: Category | ''
  ingredients: { name: string; qty: number; unit: Unit }[]
  steps: { text: string }[]
  prepMinutes: number
  servings: number
}

type Props = {
  initial?: Recipe
  submitLabel: string
  onSubmit: (input: RecipeInput) => Promise<void>
}

function toDefaults(r?: Recipe): FormValues {
  return {
    title: r?.title ?? '',
    description: r?.description ?? '',
    category: r?.category ?? '',
    ingredients: r?.ingredients.map((i) => ({ ...i })) ?? [{ name: '', qty: NaN, unit: 'g' }],
    steps: r?.steps.map((text) => ({ text })) ?? [{ text: '' }],
    prepMinutes: r?.prepMinutes ?? NaN,
    servings: r?.servings ?? NaN,
  }
}

const isInt = (v: number) => Number.isInteger(v) || 'Use a whole number'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} className="mt-1 text-sm text-destructive">{message}</p>
}

const labelClass = 'mb-1 block text-sm font-medium'

export function RecipeForm({ initial, submitLabel, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: toDefaults(initial), mode: 'onTouched' })
  const photo = useImageUpload()
  // The photo already saved on the recipe (edit mode); null once removed.
  const [existingPhoto, setExistingPhoto] = useState<string | null>(initial?.photoUrl ?? null)

  const ingredients = useFieldArray({
    control,
    name: 'ingredients',
    rules: { minLength: { value: 1, message: 'Add at least one ingredient' } },
  })
  const steps = useFieldArray({
    control,
    name: 'steps',
    rules: { minLength: { value: 1, message: 'Add at least one step' } },
  })

  async function submit(v: FormValues) {
    // Upload first so the recipe is saved with its final photo URL.
    let photoUrl = existingPhoto
    if (photo.hasNewPhoto) {
      try {
        photoUrl = await photo.upload()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'The photo could not be uploaded.')
        return
      }
    }

    await onSubmit({
      title: v.title.trim(),
      description: v.description.trim() || null,
      category: v.category as Category,
      ingredients: v.ingredients.map((i) => ({ name: i.name.trim(), qty: i.qty, unit: i.unit })),
      steps: v.steps.map((s) => s.text.trim()),
      prepMinutes: v.prepMinutes,
      servings: v.servings,
      photoUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="max-w-3xl space-y-10">
      <fieldset className="space-y-5">
        <legend className="sr-only">Basics</legend>

        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <Input
            id="title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title', {
              required: 'Give the recipe a title',
              validate: (v) => {
                const n = v.trim().length
                return (n >= 2 && n <= 80) || 'Use 2 to 80 characters'
              },
            })}
          />
          <FieldError id="title-error" message={errors.title?.message} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Textarea id="description" rows={2} {...register('description')} />
        </div>

        <PhotoPicker
          imageUrl={photo.previewUrl ?? existingPhoto}
          processing={photo.processing}
          error={photo.error}
          onSelect={photo.select}
          onRemove={() => {
            photo.clear()
            setExistingPhoto(null)
          }}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <Controller
              control={control}
              name="category"
              rules={{ validate: (v) => (CATEGORIES as readonly string[]).includes(v) || 'Choose a category' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="category"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    className="w-full"
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                  >
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="category-error" message={errors.category?.message} />
          </div>

          <div>
            <label htmlFor="prepMinutes" className={labelClass}>Prep time (minutes)</label>
            <Input
              id="prepMinutes"
              type="number"
              inputMode="numeric"
              min={1}
              max={1440}
              aria-invalid={!!errors.prepMinutes}
              aria-describedby={errors.prepMinutes ? 'prep-error' : undefined}
              {...register('prepMinutes', {
                valueAsNumber: true,
                validate: (v) => (Number.isNaN(v) ? 'Enter the prep time' : isInt(v)),
                min: { value: 1, message: 'At least 1 minute' },
                max: { value: 1440, message: 'At most 1440 minutes (24 hours)' },
              })}
            />
            <FieldError id="prep-error" message={errors.prepMinutes?.message} />
          </div>

          <div>
            <label htmlFor="servings" className={labelClass}>Servings</label>
            <Input
              id="servings"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              aria-invalid={!!errors.servings}
              aria-describedby={errors.servings ? 'servings-error' : undefined}
              {...register('servings', {
                valueAsNumber: true,
                validate: (v) => (Number.isNaN(v) ? 'Enter the number of servings' : isInt(v)),
                min: { value: 1, message: 'At least 1' },
                max: { value: 100, message: 'At most 100' },
              })}
            />
            <FieldError id="servings-error" message={errors.servings?.message} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-2xl font-semibold">Ingredients</legend>
        <div className="mt-1 hidden grid-cols-[1fr_6rem_7rem_2rem] gap-2 text-xs text-muted-foreground sm:grid" aria-hidden="true">
          <span>Name</span><span>Amount</span><span>Unit</span>
        </div>
        <ul className="mt-2 space-y-3">
          {ingredients.fields.map((field, i) => {
            const err = errors.ingredients?.[i]
            return (
              <li key={field.id}>
                <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_6rem_7rem_2rem]">
                  <Input
                    aria-label={`Ingredient ${i + 1} name`}
                    placeholder="e.g. Flour"
                    className="col-span-2 sm:col-span-1"
                    aria-invalid={!!err?.name}
                    {...register(`ingredients.${i}.name`, {
                      validate: (v, all) => {
                        const name = v.trim().toLowerCase()
                        if (!name) return 'Enter a name'
                        const dupes = all.ingredients.filter((x) => x.name.trim().toLowerCase() === name).length
                        return dupes < 2 || 'This ingredient is listed twice'
                      },
                    })}
                  />
                  <div className="col-span-2 grid grid-cols-[1fr_1fr_2rem] gap-2 sm:contents">
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      min={0}
                      aria-label={`Ingredient ${i + 1} amount`}
                      placeholder="Amount"
                      aria-invalid={!!err?.qty}
                      {...register(`ingredients.${i}.qty`, {
                        valueAsNumber: true,
                        validate: (v) => (!Number.isNaN(v) && v > 0) || 'Enter an amount above 0',
                      })}
                    />
                    <Controller
                      control={control}
                      name={`ingredients.${i}.unit`}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger ref={f.ref} className="w-full" aria-label={`Ingredient ${i + 1} unit`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {UNITS.map((u) => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ingredient ${i + 1}`}
                      disabled={ingredients.fields.length === 1}
                      onClick={() => ingredients.remove(i)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
                {(err?.name || err?.qty) && (
                  <p className="mt-1 text-sm text-destructive">
                    {[err.name?.message, err.qty?.message].filter(Boolean).join('. ')}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        <FieldError id="ingredients-error" message={errors.ingredients?.root?.message} />
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => ingredients.append({ name: '', qty: NaN, unit: 'g' })}
        >
          <PlusIcon aria-hidden="true" />
          Add ingredient
        </Button>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-2xl font-semibold">Steps</legend>
        <ol className="mt-3 space-y-3">
          {steps.fields.map((field, i) => {
            const err = errors.steps?.[i]?.text
            return (
              <li key={field.id}>
                <div className="flex gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium" aria-hidden="true">
                    {i + 1}
                  </span>
                  <Textarea
                    rows={2}
                    aria-label={`Step ${i + 1}`}
                    aria-invalid={!!err}
                    className="flex-1"
                    {...register(`steps.${i}.text`, {
                      validate: (v) => v.trim().length > 0 || 'Describe this step or remove it',
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove step ${i + 1}`}
                    disabled={steps.fields.length === 1}
                    onClick={() => steps.remove(i)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
                {err && <p className="mt-1 ml-10 text-sm text-destructive">{err.message}</p>}
              </li>
            )
          })}
        </ol>
        <FieldError id="steps-error" message={errors.steps?.root?.message} />
        <Button type="button" variant="outline" className="mt-3" onClick={() => steps.append({ text: '' })}>
          <PlusIcon aria-hidden="true" />
          Add step
        </Button>
      </fieldset>

      <div className="flex gap-2 border-t border-border pt-6">
        <Button type="submit" size="lg" disabled={isSubmitting || photo.processing}>
          {photo.uploading ? 'Uploading photo…' : isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
