type StatusBadgeProps = {
  isActive: boolean;
  size?: 'sm' | 'md';
};

export default function StatusBadge({ isActive, size = 'sm' }: StatusBadgeProps) {
  const fontSize = size === 'md' ? '0.7rem' : '0.6rem';
  const padding = size === 'md' ? '0.3rem 0.75rem' : '0.2rem 0.5rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        borderRadius: '2px',
        fontSize,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: 500,
        background: isActive
          ? 'rgba(76, 175, 80, 0.12)'
          : 'rgba(138, 128, 120, 0.12)',
        color: isActive ? '#81C784' : '#8A8078',
        border: `1px solid ${isActive ? 'rgba(76,175,80,0.25)' : 'rgba(138,128,120,0.2)'}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: isActive ? '#81C784' : '#8A8078',
          flexShrink: 0,
        }}
      />
      {isActive ? 'Active' : 'Draft'}
    </span>
  );
}
