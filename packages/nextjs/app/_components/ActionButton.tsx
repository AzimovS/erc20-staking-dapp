interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  isLoading,
  loadingText,
  defaultText,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`btn btn-xs btn-secondary ${isLoading ? "loading" : ""}`}
  >
    {isLoading ? loadingText : defaultText}
  </button>
);
