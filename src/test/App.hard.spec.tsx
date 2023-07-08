import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from 'App';
import * as remotes from 'pages/remotes';
import { delay, mockConsoleError } from './utils';

describe('App hard', () => {
  mockConsoleError();
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('바깥을 클릭하면 키패드가 닫힌다', async () => {
    render(<App />);

    userEvent.click(await screen.findByLabelText<HTMLInputElement>(`비밀번호`));

    userEvent.click(document.body);
    await delay(100);
    expect(screen.queryByText(/비밀번호를 입력하세요/)).not.toBeInTheDocument();
    expect(screen.queryByText(/6자리로 입력해주세요/)).not.toBeInTheDocument();
  });

  test('키패드는 중복으로 열리지 않는다', async () => {
    render(<App />);

    userEvent.click(await screen.findByLabelText<HTMLInputElement>(`비밀번호`));

    userEvent.click(await screen.findByLabelText<HTMLInputElement>(`비밀번호 확인`));

    expect(await screen.findAllByText(/비밀번호를 입력하세요/)).toHaveLength(1);
    expect(await screen.findAllByText(/6자리로 입력해주세요/)).toHaveLength(1);
  });

  test('SHUFFLE 키를 입력하면 키보드 데이터를 다시 받아온다', async () => {
    render(<App />);

    userEvent.click(await screen.findByLabelText<HTMLInputElement>(`비밀번호`));

    await delay(500);

    const spyOnCreate = jest.spyOn(remotes, 'createKeypad');
    userEvent.click(await screen.findByTestId('shuffle'));

    await delay(500);
    expect(spyOnCreate).toHaveBeenCalled();
  });

  test('입력된 값을 백스페이스로 지울 수 있다', async () => {
    render(<App />);

    userEvent.click(await screen.findByLabelText<HTMLInputElement>(`비밀번호`));

    userEvent.click(await screen.findByTestId(6));
    userEvent.click(await screen.findByTestId(4));
    expect((await screen.findByLabelText<HTMLInputElement>(`비밀번호`)).value).toHaveLength(2);

    userEvent.type(await screen.findByLabelText<HTMLInputElement>(`비밀번호`), '{backspace}');
    expect((await screen.findByLabelText<HTMLInputElement>(`비밀번호`)).value).toHaveLength(1);
  });
});
