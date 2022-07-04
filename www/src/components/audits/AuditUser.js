import { Box, Text } from 'grommet'

import Avatar from '../users/Avatar'

export function AuditUser({ user }) {
  return (
    <Box
      flex={false}
      direction="row"
      gap="xsmall"
      align="center"
    >
      <Avatar
        user={user}
        size="24px"
      />
      <Text size="small">{user.name}</Text>
    </Box>
  )
}
