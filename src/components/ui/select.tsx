'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  name?: string
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select an option',
      disabled,
      className,
      name,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value || '')

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue)
      onValueChange?.(optionValue)
      setOpen(false)
    }

    const selectedOption = options.find(
      option => option.value === selectedValue
    )

    return (
      <div className="relative">
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onClick={() => !disabled && setOpen(!open)}
          {...props}
        >
          <span className={cn(!selectedOption && 'text-muted-foreground')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-full left-0 z-20 w-full mt-1 bg-popover text-popover-foreground shadow-md border rounded-md py-1 max-h-60 overflow-auto">
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === selectedValue}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex w-full cursor-default select-none items-center py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
                    option.value === selectedValue &&
                      'bg-accent text-accent-foreground'
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === selectedValue && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={selectedValue} />
      </div>
    )
  }
)
Select.displayName = 'Select'
