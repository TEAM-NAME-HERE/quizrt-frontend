import * as React from 'react';
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

export interface Answer {
  id: string;
  description: string;
  isCorrect: boolean;
  order?: number;
}

export const emptyAnswer = (id: string): Answer => ({
  id,
  description: '',
  isCorrect: false
});

export interface AnswerProps {
  initialAnswer?: Answer;
  onChange: (answer: Answer) => void;
  onDelete: (answer: Answer) => void;
}

class EditAnswerItem extends React.Component<AnswerProps, Answer> {
  static defauptProps = {
    initialAnswer: emptyAnswer('')
  };
  constructor(p: AnswerProps) {
    super(p);

    this.state = p.initialAnswer as Answer;
  }

  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.props.onChange({
      ...this.state,
      [name]: value
    });
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  // tslint:disable-next-line:no-any
  handleSwitch = (name: string) => (_: any, c: boolean) => {
    this.props.onChange({
      ...this.state,
      [name]: c
    });
    this.setState({
      ...this.state,
      [name]: c
    });
  }

  render() {
    // tslint:disable-next-line:no-any
    const { initialAnswer: { id }} = this.props as any;
    const { onDelete } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <TextField
          id={`answer-${id}-desc`}
          label="Description"
          value={this.state.description}
          onChange={this.handleChange('description')}
          margin="normal"
        />
        <FormGroup>
          <FormControlLabel
            control={
            <Switch
              checked={this.state.isCorrect}
              onChange={this.handleSwitch('isCorrect')}
              aria-label="isCorrect"
            />}
            label="Correct"
          />
        </FormGroup>
        <IconButton onClick={() => onDelete(this.state)} aria-label="Delete Answer">
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
}

export default EditAnswerItem;
