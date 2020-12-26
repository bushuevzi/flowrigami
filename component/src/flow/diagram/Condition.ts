import Guid from '@app/flow/utils/TsUtils';

export default class Condition {
    public id: string;
    public name: string;
    public description: string;
    public expression: string;
    public errorMessage: string;

    constructor() {
        this.id = Guid.newGuid();
        this.name = '';
        this.description = '';
        this.expression = '';
        this.errorMessage = '';
    }
}
