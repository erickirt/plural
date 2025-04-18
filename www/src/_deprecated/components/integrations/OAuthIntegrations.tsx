import { Box, Text } from 'grommet'
import { Check as Checkmark } from 'forge-core'

import { ZOOM_ICON, ZOOM_INSTALL_URL } from './constants'
import { OAuthService } from './types'
import { useOauthIntegrationsQuery } from '../../../generated/graphql'

function redirectUrl(format, service) {
  const location = `${
    window.location.origin
  }/oauth/accept/${service.toLowerCase()}`

  return format.replace('{redirect_uri}', encodeURIComponent(location))
}

function Integration({
  icon,
  installUrl,
  integrations,
  service,
  children,
}: any) {
  const connected = !!integrations[service]
  const onClick = connected
    ? undefined
    : () => (window.location = redirectUrl(installUrl, service))

  return (
    <Box
      flex={false}
      pad="small"
      border={{ color: 'border' }}
      hoverIndicator="light-2"
      onClick={onClick}
      direction="row"
      align="center"
      round="xsmall"
      gap="small"
    >
      <Box flex={false}>
        <img
          src={icon}
          alt=""
          height="50px"
          width="50px"
        />
      </Box>
      <Box fill="horizontal">{children}</Box>
      {connected && (
        <Box
          flex={false}
          direction="row"
          gap="xsmall"
          align="center"
        >
          <Checkmark
            color="brand"
            size="15px"
          />
          <Text size="small">Connected</Text>
        </Box>
      )}
    </Box>
  )
}

export function OAuthIntegrations() {
  const { data } = useOauthIntegrationsQuery({
    fetchPolicy: 'cache-and-network',
  })

  if (!data) return null

  const integrations = data.oauthIntegrations.reduce(
    (acc, int) => ({ ...acc, [int.service]: int }),
    {}
  )

  return (
    <Box
      fill
      pad="small"
      gap="xsmall"
    >
      <Integration
        icon={ZOOM_ICON}
        installUrl={ZOOM_INSTALL_URL}
        integrations={integrations}
        service={OAuthService.ZOOM}
      >
        <Text size="small">
          <i>
            Create meetings in your zoom account for resolving incidents and
            more
          </i>
        </Text>
      </Integration>
    </Box>
  )
}
