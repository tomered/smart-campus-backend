import {Entity, PrimaryColumn, Column, BaseEntity} from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
    @PrimaryColumn()
    id! : number;

    @Column()
    role! : string;

}
