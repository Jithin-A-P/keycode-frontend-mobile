import Campaign from '../entity/campaign.entity'; // Import your campaign entity
import NotFoundException from '../exception/not-found.exception';
import CampaignRepository from '../repository/campaign.repository';
import CampaignDto from '../dto/campaign.dto';
import KioskTimeSlotRepository from '../repository/kiosk.timeslot.repository';

class CamapignService {
  constructor(private campaignRepository: CampaignRepository,private kioskTimeslotRepository: KioskTimeSlotRepository ) {}

  public getAllCampaigns = (
    rowsPerPage: number,
    pageNumber: number
  ): Promise<[Campaign[], number]> => {
    const defaultRowsPerPage = 15;
    const take = rowsPerPage || defaultRowsPerPage;

    const rowsToSkip = (pageNumber - 1) * take;
    const skip = rowsToSkip > 0 ? rowsToSkip : 0;
    
    return this.campaignRepository.findAll(skip, take);
  }

  public getCampaignById = async (id: string): Promise<Campaign> => {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign not found with id: ${id}`);
    }
    
    return campaign;
  }

  public removeCampaignById = async (id: string): Promise<void> => {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign not found with id: ${id}`);
    }
    
    await this.campaignRepository.remove(campaign);
  }

  public addCampaign = async (campaignDto: CampaignDto): Promise<Campaign> => {
    const {  timeSlotsIds,...rest } = campaignDto;
    const kiosktimeSlots = await this.kioskTimeslotRepository.findByIds(timeSlotsIds);
    rest.timeSlots= kiosktimeSlots;

    const campaign = await this.campaignRepository.add(rest);
    return campaign;
  }

  public updateCampaign = async (
    id: string,
    campaignDto: CampaignDto
  ): Promise<Campaign> => {
    const  campaign= await this.getCampaignById(id);

    const updatedCamapign = await this.campaignRepository.update({
      ...campaign,
      ...campaignDto
    });

    return updatedCamapign;
  }
}

export default CamapignService;