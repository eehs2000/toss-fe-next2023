import { rest } from 'msw';
import { z } from 'zod';
import { CreateKeypadResponse, createKeypadResponse } from './data/tossWorld';

const keypadResponseMap = new Map<string, CreateKeypadResponse>();

export function handlers() {
  return [rest.post('/api/keypad', createKeypad), rest.post('/api/password', submitPassword)];
}

const createKeypad: Parameters<typeof rest.post>[1] = (_, res, ctx) => {
  const keypadResponse = createKeypadResponse();

  keypadResponseMap.set(keypadResponse.uid, keypadResponse);

  return res(ctx.status(200), ctx.json(keypadResponse));
};

const KeypadInputResultSchema = z.object({
  uid: z.string(),
  coords: z.array(z.object({ x: z.number(), y: z.number() })),
});

const submitPassword: Parameters<typeof rest.post>[1] = (req, res, ctx) => {
  const { password, confirmPassword } = z
    .object({ password: KeypadInputResultSchema, confirmPassword: KeypadInputResultSchema })
    .parse(req.body);

  if (password.uid === confirmPassword.uid) {
    return res(ctx.status(400, 'You must use two different keypads'));
  }

  const passwordKeypad = keypadResponseMap.get(password.uid);
  const confirmPasswordKeypad = keypadResponseMap.get(confirmPassword.uid);

  if (passwordKeypad == null || confirmPasswordKeypad == null) {
    return res(ctx.status(404, 'Keypad not found'));
  }

  try {
    if (password.coords.length !== 6 || confirmPassword.coords.length !== 6) {
      return res(ctx.status(400, 'Password must be entered as 6 characters'));
    }

    const passwordKeys = password.coords.map(({ x, y }) => extractTestIdFromSVG(passwordKeypad.keypad.svgGrid[x][y]));
    const confirmPasswordKeys = confirmPassword.coords.map(({ x, y }) =>
      extractTestIdFromSVG(confirmPasswordKeypad.keypad.svgGrid[x][y])
    );

    if (passwordKeys.includes('blank') || confirmPasswordKeys.includes('blank')) {
      return res(ctx.status(400, "You can't enter a blank"));
    }

    if (passwordKeys.join('') !== confirmPasswordKeys.join('')) {
      return res(ctx.status(400, 'Passwords do not match'));
    }

    return res(ctx.status(200), ctx.text(passwordKeys.join('')));
  } catch {
    return res(ctx.status(400, 'input decryption failed'));
  }
};

function extractTestIdFromSVG(svgElement: string): string {
  const regex = /data-testid="([^"]+)"/;
  const matches = svgElement.match(regex);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return '';
}
