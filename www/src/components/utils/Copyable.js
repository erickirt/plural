import React, { useState } from 'react'
import { Box, Layer, Text } from 'grommet'
import { CircleInformation, Copy, Close } from 'grommet-icons'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Icon } from '../accounts/Group'
import { truncate } from 'lodash'

export function Copyable({text, pillText, displayText, onCopy}) {
  const [display, setDisplay] = useState(false)
  const [hover, setHover] = useState(false)
  return (
    <>
    <CopyToClipboard text={text} onCopy={() => onCopy ? onCopy() : setDisplay(true)}>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{cursor: 'pointer'}}
        direction='row'
        align='center'
        round='xsmall'
        gap='xsmall'>
        <Text size='small'>{truncate(displayText || text, 40)}</Text>
        {hover && (
          <Box animation={{type: 'fadeIn', duration: 200}}>
            <Copy size='12px' color='dark-3' />
          </Box>
        )}
      </Box>
    </CopyToClipboard>
    {display && (
      <Layer position='top' plain onEsc={() => setDisplay(false)} 
             onClickOutside={() => setDisplay(false)}>
        <Box direction='row' align='center' gap='small' background='white' 
             border={{color: 'light-3'}} round='xsmall' margin={{top: 'small'}}
             pad={{horizontal: 'small', vertical: 'xsmall'}}>
          <CircleInformation color='progress' size='medium' />
          <Text>{pillText}</Text>
          <Icon icon={Close} onClick={() => setDisplay(false)} />
        </Box>
      </Layer>
    )}
    </>
  )
}