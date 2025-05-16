import { CompanyDocument } from '../schemas/company.schema';

export class QueryCompanyDto {
    current: number;
    pageSize: number;
    name?: string;
    location?: string;
}

export interface ICompanyWithJobCount extends CompanyDocument {
    jobCount: number;
}

export interface IFindAllResponse {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: ICompanyWithJobCount[];
}
