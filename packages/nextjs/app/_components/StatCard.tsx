interface StatCardProps {
  title: string;
  value: string;
  action?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, action }) => (
  <div className="stat">
    <div className="stat-title">
      {title} {action}
    </div>
    <div className="stat-value">{value}</div>
  </div>
);
