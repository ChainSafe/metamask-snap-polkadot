import { Input, Button, FormControl, InputLabel, Box, Grid } from '@material-ui/core';
import type { FC } from 'react';
import { useState } from 'react';

export type CustomNetworkConfigInput = {
  networkName?: string;
  genesisHash?: `0x${string}`;
  rpcUrl?: string;
  addressPrefix?: number;
  unitDecimals?: number;
  unitSymbol?: string;
  unitImage?: string;
};

interface ICustonNetworkConfig {
  onSubmit: (customNetworkConfigParams: CustomNetworkConfigInput) => void;
}

export const CustonNetworkConfig: FC<ICustonNetworkConfig> = ({ onSubmit }) => {
  const [customNetworkInput, setCustomNetworkInput] = useState<CustomNetworkConfigInput | null>(
    null
  );

  const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    e.preventDefault();
    if (!e.target.name) return;
    const inputName = e.target.name as keyof CustomNetworkConfigInput;

    setCustomNetworkInput({ ...customNetworkInput, [inputName]: e.target.value });
  };

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!customNetworkInput) return;

    const unitDecimalsNum = customNetworkInput.unitDecimals
      ? Number(customNetworkInput.unitDecimals)
      : undefined;
    const addressPrefixNum = customNetworkInput.addressPrefix
      ? Number(customNetworkInput.addressPrefix)
      : undefined;
    onSubmit({
      ...customNetworkInput,
      unitDecimals: unitDecimalsNum,
      addressPrefix: addressPrefixNum
    });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <Grid direction="column" alignItems="center" justifyContent="center" container>
        <Box>
          <FormControl required>
            <InputLabel htmlFor="networkName">Network name</InputLabel>
            <Input name="networkName" onChange={onInputChange} />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="genesisHash">Network genesis hash</InputLabel>
            <Input name="genesisHash" onChange={onInputChange} />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="rpcUrl">RPC url</InputLabel>
            <Input required placeholder="rpc url" name="rpcUrl" onChange={onInputChange} />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="addressPrefix">ss58 address prefix</InputLabel>
            <Input
              type="number"
              required
              placeholder="address ss58 prefix"
              name="addressPrefix"
              onChange={onInputChange}
            />
          </FormControl>
        </Box>
        <Box>
          <Input
            type="number"
            placeholder="unit decimals"
            name="unitDecimals"
            onChange={onInputChange}
          />
          <Input placeholder="unit symbol" name="unitSymbol" onChange={onInputChange} />
          <Input placeholder="unit image url" name="unitImage" onChange={onInputChange} />
        </Box>
        <Box>
          <Button type="submit">Change network</Button>
        </Box>
      </Grid>
    </form>
  );
};
