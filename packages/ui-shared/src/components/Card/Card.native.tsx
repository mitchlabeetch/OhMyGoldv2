import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { CardProps, MetricCardProps, ProfileCardProps } from "./Card.types";

const paddingMap = {
  none: 0,
  sm: 12,
  md: 20,
  lg: 28,
};

export function Card({
  variant = "content",
  padding = "md",
  shadow = false,
  bordered = true,
  hoverable = false,
  isLoading = false,
  children,
  style,
  onTouchEnd,
  ...props
}: CardProps & { style?: object; onTouchEnd?: () => void }) {
  const inner = (
    <View
      style={[
        styles.card,
        bordered && styles.bordered,
        shadow && styles.shadow,
        isLoading && styles.loading,
        { padding: paddingMap[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (hoverable && onTouchEnd) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onTouchEnd}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
  isLoading = false,
  style,
}: MetricCardProps & { style?: object }) {
  const trendColor =
    trend === undefined ? "#737373" : trend > 0 ? "#22C55E" : trend < 0 ? "#EF4444" : "#737373";

  const TrendArrow =
    trend === undefined ? null : trend > 0 ? "↑" : trend < 0 ? "↓" : "→";

  return (
    <View style={[styles.card, styles.bordered, { padding: 20 }, style]}>
      <View style={styles.metricHeader}>
        <View style={styles.metricIcon}>{icon}</View>
        {TrendArrow && trend !== undefined && (
          <View style={styles.trendBadge}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {TrendArrow} {trendLabel ?? `${Math.abs(trend)}%`}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{isLoading ? "—" : value}</Text>
    </View>
  );
}

export function ProfileCard({
  avatarUrl,
  firstName,
  lastName,
  role,
  email,
  phone,
  isActive = true,
  actions,
}: ProfileCardProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <View style={[styles.card, styles.bordered, { padding: 20 }]}>
      <View style={styles.profileRow}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              accessibilityLabel={`${firstName} ${lastName}`}
            />
          ) : (
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          )}
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: isActive ? "#22C55E" : "#525252" },
            ]}
            accessibilityLabel={isActive ? "Active" : "Inactive"}
          />
        </View>

        {/* Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.profileRole} numberOfLines={1}>
            {role}
          </Text>
          {email ? (
            <Text style={styles.profileDetail} numberOfLines={1}>
              {email}
            </Text>
          ) : null}
          {phone ? (
            <Text style={styles.profileDetail} numberOfLines={1}>
              {phone}
            </Text>
          ) : null}
        </View>
      </View>

      {actions ? (
        <View style={styles.actionsRow}>{actions}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
  },
  bordered: {
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loading: {
    opacity: 0.5,
  },
  // Metric
  metricHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricIcon: {
    color: "#737373",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricLabel: {
    fontSize: 13,
    color: "#A3A3A3",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FAFAFA",
  },
  // Profile
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  initialsAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,236,0,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,236,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#FFEC00",
    fontSize: 18,
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FAFAFA",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 13,
    color: "#737373",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  profileDetail: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
});
