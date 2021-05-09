import { Timestamp } from 'rxjs/internal/operators/timestamp';
import UserView from './UserView';

export default class MessageView {
    public id : string;
    public value: string;
    public timestamp : number;
    public userId: string;
}
