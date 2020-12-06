import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-apollo'
import { InputField, InputCollection, ResponsiveInput, Button } from 'forge-core'
import { Box, Anchor, Text, TextInput } from 'grommet'
import Repositories from '../repos/Repositories'
import CreateRepository from '../repos/CreateRepository'
import { CurrentUserContext } from '../login/CurrentUser'
import { EDIT_PUBLISHER, LINK_ACCOUNT } from './queries'
import { ME_Q } from '../users/queries'
import { CONNECT_ICON, AUTHORIZE_URL } from './constants'
import { Add, Edit, List, Stripe } from 'grommet-icons'
import { STRIPE_BLUE } from '../payments/constants'
import { EditContent, EditContext, EditSelect } from '../users/EditUser'
import { BreadcrumbsContext } from '../Breadcrumbs'
import { SIDEBAR_WIDTH } from '../constants'

function AccountConnected() {
  return (
    <Box pad='xsmall' justify='center' align='center' direction='row'
         gap='xsmall' border={{color: 'light-5'}} round='xsmall'>
      <Stripe color={STRIPE_BLUE} size='medium' />
      <Anchor href='https://dashboard.stripe.com/' size='small'>stripe dashboard</Anchor>
    </Box>
  )
}

function PublisherPayments({billingAccountId}) {
  const [mutation] = useMutation(LINK_ACCOUNT, {
    update: (cache, {data: { linkPublisher }}) => {
      const prev = cache.readQuery({ query: ME_Q })
      cache.writeQuery({query: ME_Q, data: {
        ...prev, me: {
          ...prev.me,
          publisher: linkPublisher
        }
      }})
    }
  })
  const params = new URLSearchParams(window.location.search);
  const token = params.get('code')

  useEffect(() => {
    if (token && !billingAccountId) {
      mutation({variables: {token}})
    }
  }, [token, billingAccountId, mutation])

  return (
    <Box pad='small' align='center' justify='center' border={{color: 'light-5'}} round='xsmall'>
      <a href={AUTHORIZE_URL}>
        <img alt='' src={CONNECT_ICON} />
      </a>
    </Box>
  )
}

function AddressForm({address, onChange}) {
  return (
    <Box pad={{horizontal: 'small'}}>
      <InputCollection>
        <ResponsiveInput
          label='line 1'
          value={address.line1}
          placeholder='street address'
          onChange={({target: {value}}) => onChange({...address, line1: value})} />
        <ResponsiveInput
          label='line 2'
          value={address.line2}
          placeholder='apt number, suite number, etc'
          onChange={({target: {value}}) => onChange({...address, line2: value})} />
        <ResponsiveInput
          label='city'
          value={address.city}
          placeholder='city'
          onChange={({target: {value}}) => onChange({...address, city: value})} />
        <ResponsiveInput
          label='state'
          value={address.state}
          placeholder='state'
          onChange={({target: {value}}) => onChange({...address, state: value})} />
        <tr>
          <td>
            <Text size='small' weight='bold'>country</Text>
          </td>
          <td>
            <Box direction='row' gap='small'>
              <TextInput
                label='country'
                value={address.country}
                placeholder='country'
                onChange={({target: {value}}) => onChange({...address, country: value})} />
              <InputField
                label='zip'
                value={address.zip}
                labelWidth='30px'
                placeholder='zip'
                onChange={({target: {value}}) => onChange({...address, zip: value})} />
            </Box>
          </td>
        </tr>
      </InputCollection>
    </Box>
  )
}

const defaultAddress = {line1: '', line2: '', city: '', state: '', zip: '', country: 'United States'}

function EditPublisher({description, phone, address: {__typename, ...address}}) {
  const [attributes, setAttributes] = useState({description, phone, address: (address || defaultAddress)})
  const [mutation, {loading}] = useMutation(EDIT_PUBLISHER, {
    variables: {attributes},
    update: (cache, { data: { updatePublisher } }) => {
      const prev = cache.readQuery({ query: ME_Q })
      cache.writeQuery({query: ME_Q, data: {
        ...prev, me: {
          ...prev.me,
          publisher: updatePublisher
        }
      }})
    }
  })

  return (
    <Box gap='small' pad='small'>
      <Box pad={{horizontal: 'small'}}>
        <InputCollection>
          <ResponsiveInput
            label='description'
            value={attributes.description}
            onChange={({target: {value}}) => setAttributes({...attributes, description: value})} />
          <ResponsiveInput
            label='phone'
            value={attributes.phone}
            onChange={({target: {value}}) => setAttributes({...attributes, phone: value})} />
        </InputCollection>
      </Box>
      <Box border='top' pad={{top: 'small'}} gap='small'>
        <Text size='small' margin={{left: 'small'}} style={{fontWeight: 500}}>Address</Text>
        <AddressForm
          address={attributes.address}
          onChange={(address) => setAttributes({...attributes, address})} />
      </Box>
      <Box direction='row' justify='end' pad={{horizontal: '16px'}}>
        <Button
          loading={loading}
          pad={{horizontal: 'medium', vertical: 'xsmall'}}
          round='xsmall'
          label='Update'
          onClick={mutation} />
      </Box>
    </Box>
  )
}

export default function MyPublisher() {
  const me = useContext(CurrentUserContext)
  const {setBreadcrumbs} = useContext(BreadcrumbsContext)
  const [editing, setEditing] = useState('Repositories')
  useEffect(() => {
    if (!me.publisher) return
    setBreadcrumbs([{url: `/publishers/${me.publisher.id}`, text: me.publisher.name}])
  }, [me, setBreadcrumbs])

  return (
    <EditContext.Provider value={{editing, setEditing}}>
    <Box fill direction='row'>
      <Box width={SIDEBAR_WIDTH} flex={false} pad='small' gap='xsmall'>
        <EditSelect edit='Repositories' icon={<List size='small' />} />
        <EditSelect edit='Edit Attributes' icon={<Edit size='small' />} />
        <EditSelect edit='Create Repository' icon={<Add size='small' />} />
        {me.publisher.billingAccountId && <AccountConnected />}
        {!me.publisher.billingAccountId && (<PublisherPayments {...me.publisher} />)}
      </Box>
      <Box fill style={{overflow: 'auto'}} pad='small'>
        <EditContent edit='Repositories'>
          <Repositories publisher={me.publisher} deletable columns={2} />
        </EditContent>
        <EditContent edit='Edit Attributes'>
          <EditPublisher {...me.publisher} />
        </EditContent>
        <EditContent edit='Create Repository'>
          <CreateRepository publisher={me.publisher} />
        </EditContent>
      </Box>
    </Box>
    </EditContext.Provider>
  )
}