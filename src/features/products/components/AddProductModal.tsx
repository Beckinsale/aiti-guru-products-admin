// @req FR-PROD-006
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { addProductSchema, type AddProductFormValues } from '@/features/products/validators/addProductSchema'

interface AddProductModalProps {
  open: boolean
  onClose: () => void
}

export const AddProductModal = ({ open, onClose }: AddProductModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema) as Resolver<AddProductFormValues>,
    defaultValues: { title: '', price: undefined, brand: '', sku: '' },
  })

  const onSubmit = () => {
    toast.success('Товар добавлен')
    reset()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Добавить товар</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-[6px]">
            <Label htmlFor="add-title">Наименование</Label>
            <Input
              id="add-title"
              placeholder="Введите название"
              {...register('title')}
              className={errors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label htmlFor="add-price">Цена, ₽</Label>
            <Input
              id="add-price"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              {...register('price')}
              className={errors.price ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label htmlFor="add-brand">Вендор</Label>
            <Input
              id="add-brand"
              placeholder="Введите вендора"
              {...register('brand')}
              className={errors.brand ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
            />
            {errors.brand && (
              <p className="text-xs text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <Label htmlFor="add-sku">Артикул</Label>
            <Input
              id="add-sku"
              placeholder="Введите артикул"
              {...register('sku')}
              className={errors.sku ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
            />
            {errors.sku && (
              <p className="text-xs text-red-500">{errors.sku.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
