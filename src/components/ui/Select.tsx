import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  id?: string;
  clearable?: boolean;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecionar...',
  disabled = false,
  className = '',
  error = false,
  id,
  clearable = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const isMobile = useIsMobile();

  const listOptions: SelectOption[] = clearable
    ? [{ value: '', label: placeholder }, ...options]
    : options;

  const selectedLabel =
    options.find((o) => o.value === value)?.label ??
    (value ? value : placeholder);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // Lock body scroll when bottom sheet is open on mobile
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, isMobile, close]);

  useEffect(() => {
    if (!open || isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, listOptions.length - 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        onChange(listOptions[highlightedIndex].value);
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isMobile, close, highlightedIndex, listOptions, onChange]);

  useEffect(() => {
    if (!open || highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  const handleSelect = (optionValue: string) => {
    if (!clearable && !optionValue) return;
    onChange(optionValue);
    close();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      const currentIndex = listOptions.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  };

  const bottomSheet =
    open && isMobile
      ? createPortal(
          <div
            className="select-sheet-overlay"
            onMouseDown={close}
          >
            <div
              className="select-sheet"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="select-sheet-handle" />
              <div className="select-sheet-header">
                <span className="select-sheet-title">{placeholder}</span>
                <button
                  type="button"
                  className="select-sheet-close"
                  onClick={close}
                  aria-label="Fechar"
                >
                  <X size={16} />
                </button>
              </div>
              <ul className="select-sheet-list" role="listbox">
                {listOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value || '__empty__'}
                      role="option"
                      aria-selected={isSelected}
                      className={[
                        'select-sheet-item',
                        isSelected && 'select-sheet-item--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="select-sheet-item-label">{option.label}</span>
                      {isSelected && (
                        <Check size={16} strokeWidth={2.5} className="select-sheet-item-check" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={containerRef}
        className={[
          'select',
          open && 'select--open',
          disabled && 'select--disabled',
          error && 'select--error',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button
          type="button"
          id={selectId}
          className="select-trigger"
          onClick={() => {
            if (disabled) return;
            setOpen((prev) => {
              if (!prev) {
                const currentIndex = listOptions.findIndex((o) => o.value === value);
                setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
              }
              return !prev;
            });
          }}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`select-value${!value ? ' select-value--placeholder' : ''}`}>
            {selectedLabel}
          </span>
          <ChevronDown size={16} className="select-icon" aria-hidden="true" />
        </button>

        {open && !isMobile && (
          <ul
            ref={listRef}
            className="select-content"
            role="listbox"
            aria-labelledby={selectId}
          >
            {listOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value || '__empty__'}
                  role="option"
                  aria-selected={isSelected}
                  className={[
                    'select-item',
                    isSelected && 'select-item--selected',
                    isHighlighted && 'select-item--highlighted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="select-item-indicator" aria-hidden="true">
                    {isSelected && <Check size={14} strokeWidth={2.5} />}
                  </span>
                  <span className="select-item-label">{option.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {bottomSheet}
    </>
  );
}
